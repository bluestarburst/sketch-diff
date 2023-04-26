from typing import Dict, List, Any
import base64
from PIL import Image
from io import BytesIO
from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
import torch


import numpy as np
import cv2
import controlnet_hinter

# set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
if device.type != 'cuda':
    raise ValueError("need to run on GPU")
# set mixed precision dtype
dtype = torch.bfloat16 if torch.cuda.get_device_capability()[
    0] == 8 else torch.float16

# controlnet mapping for controlnet id and control hinter
CONTROLNET_MAPPING = {
    "canny_edge": {
        "model_id": "lllyasviel/sd-controlnet-canny",
        "hinter": controlnet_hinter.hint_canny
    },
    "pose": {
        "model_id": "lllyasviel/sd-controlnet-openpose",
        "hinter": controlnet_hinter.hint_openpose
    },
    "depth": {
        "model_id": "lllyasviel/sd-controlnet-depth",
        "hinter": controlnet_hinter.hint_depth
    },
    "scribble": {
        "model_id": "lllyasviel/sd-controlnet-scribble",
        "hinter": controlnet_hinter.hint_scribble,
    },
    "segmentation": {
        "model_id": "lllyasviel/sd-controlnet-seg",
        "hinter": controlnet_hinter.hint_segmentation,
    },
    "normal": {
        "model_id": "lllyasviel/sd-controlnet-normal",
        "hinter": controlnet_hinter.hint_normal,
    },
    "hed": {
        "model_id": "lllyasviel/sd-controlnet-hed",
        "hinter": controlnet_hinter.hint_hed,
    },
    "hough": {
        "model_id": "lllyasviel/sd-controlnet-mlsd",
        "hinter": controlnet_hinter.hint_hough,
    }
}


class EndpointHandler():
    def __init__(self, path=""):
        # define default controlnet id and load controlnet
        self.control_type = "normal"
        self.controlnet = ControlNetModel.from_pretrained(
            CONTROLNET_MAPPING[self.control_type]["model_id"], torch_dtype=dtype).to(device)

        # Load StableDiffusionControlNetPipeline
        self.stable_diffusion_id = "runwayml/stable-diffusion-v1-5"
        self.pipe = StableDiffusionControlNetPipeline.from_pretrained(self.stable_diffusion_id,
                                                                      controlnet=self.controlnet,
                                                                      torch_dtype=dtype,
                                                                      safety_checker=None).to(device)
        # Define Generator with seed
        self.generator = torch.Generator(device="cpu").manual_seed(3)

    def __call__(self, data: Any) -> List[List[Dict[str, float]]]:
        """
        :param data: A dictionary contains `inputs` and optional `image` field.
        :return: A dictionary with `image` field contains image in base64.
        """
        prompt = data.pop("inputs", None)
        image = data.pop("image", None)
        strength = data.pop("strength", None)
        steps = data.pop("steps", None)
        controlnet_type = data.pop("controlnet_type", None)

        # Check if neither prompt nor image is provided
        if prompt is None and image is None:
            return {"error": "Please provide a prompt and base64 encoded image."}

        # Check if a new controlnet is provided
        if controlnet_type is not None and controlnet_type != self.control_type:
            print(
                f"changing controlnet from {self.control_type} to {controlnet_type} using {CONTROLNET_MAPPING[controlnet_type]['model_id']} model")
            self.control_type = controlnet_type
            self.controlnet = ControlNetModel.from_pretrained(CONTROLNET_MAPPING[self.control_type]["model_id"],
                                                              torch_dtype=dtype).to(device)
            self.pipe.controlnet = self.controlnet

        # hyperparamters
        num_inference_steps = data.pop("num_inference_steps", 30)
        guidance_scale = data.pop("guidance_scale", 7.5)
        negative_prompt = data.pop("negative_prompt", None)
        height = data.pop("height", None)
        width = data.pop("width", None)
        controlnet_conditioning_scale = data.pop(
            "controlnet_conditioning_scale", 1.0)

        # process image
        image = self.decode_base64_image(image)
        control_image = CONTROLNET_MAPPING[self.control_type]["hinter"](image)

        # run inference pipeline
        out = self.pipe(
            prompt=prompt,
            negative_prompt=negative_prompt,
            image=control_image,
            num_inference_steps=num_inference_steps,
            guidance_scale=strength,
            num_images_per_prompt=1,
            height=height,
            width=width,
            controlnet_conditioning_scale=controlnet_conditioning_scale,
            generator=self.generator
        )

        # return first generate PIL image
        return out.images[0]

    # helper to decode input image
    def decode_base64_image(self, image_string):
        base64_image = base64.b64decode(image_string)
        buffer = BytesIO(base64_image)
        image = Image.open(buffer)
        return image

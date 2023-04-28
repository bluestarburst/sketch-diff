from typing import Dict, List, Any
import base64
from PIL import Image
from io import BytesIO
from diffusers import StableDiffusionImg2ImgPipeline
import torch


import numpy as np

# set device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
if device.type != 'cuda':
    raise ValueError("need to run on GPU")
# set mixed precision dtype
dtype = torch.bfloat16 if torch.cuda.get_device_capability()[
    0] == 8 else torch.float16

model_id = "nitrosocke/Ghibli-Diffusion"


class EndpointHandler():
    def __init__(self, path=""):
        # define default controlnet id and load controlnet
        # Load StableDiffusionControlNetPipeline
        self.pipe = StableDiffusionImg2ImgPipeline.from_pretrained("nitrosocke/Ghibli-Diffusion", torch_dtype=torch.float16).to(
            device
        )
        # Define Generator with seed
        # self.generator = torch.Generator(device="cpu").manual_seed(3)
        self.generator = torch.Generator(device=device).manual_seed(1024)

    def __call__(self, data: Any) -> List[List[Dict[str, float]]]:
        """
        :param data: A dictionary contains `inputs` and optional `image` field.
        :return: A dictionary with `image` field contains image in base64.
        """
        prompt = data.pop("inputs", None)
        image = data.pop("image", None)
        strength = data.pop("strength", None)
        steps = data.pop("steps", None)

        # Check if neither prompt nor image is provided
        if prompt is None and image is None:
            return {"error": "Please provide a prompt and base64 encoded image."}

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
        # control_image = CONTROLNET_MAPPING[self.control_type]["hinter"](image)

        # run inference pipeline
        # out = self.pipe(
        #     prompt=prompt,
        #     negative_prompt=negative_prompt,
        #     image=control_image,
        #     num_inference_steps=num_inference_steps,
        #     guidance_scale=strength,
        #     num_images_per_prompt=1,
        #     height=height,
        #     width=width,
        #     controlnet_conditioning_scale=controlnet_conditioning_scale,
        #     generator=self.generator
        # )

        out = pipe(
            prompt=prompt,
            image=image,
            strength=0.75,
            guidance_scale=7.5,
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

import json
from typing import List
import requests as r
import base64
from PIL import Image
from io import BytesIO

ENDPOINT_URL = "" # your endpoint url
HF_TOKEN = "" # your huggingface token `hf_xxx`

# helper image utils
def encode_image(image_path):
  with open(image_path, "rb") as i:
    b64 = base64.b64encode(i.read())
  return b64.decode("utf-8")


def predict(prompt, image, negative_prompt=None, controlnet_type = "normal"):
    image = encode_image(image)

    # prepare sample payload
    request = {"inputs": prompt, "image": image, "negative_prompt": negative_prompt, "controlnet_type": controlnet_type}
    # headers
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "image/png" # important to get an image back
    }

    response = r.post(ENDPOINT_URL, headers=headers, json=request)
    if response.status_code != 200:
        print(response.text)
        raise Exception("Prediction failed")
    img = Image.open(BytesIO(response.content))
    return img


prediction = predict(
  prompt = "cloudy sky background lush landscape house and green trees, RAW photo (high detailed skin:1.2), 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3",
  negative_prompt ="lowres, bad anatomy, worst quality, low quality, city, traffic",
  controlnet_type = "hed",
  image = "huggingface.png"
)

prediction.save("result.png")
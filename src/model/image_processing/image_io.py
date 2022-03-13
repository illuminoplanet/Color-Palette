import urllib, io, base64
from PIL import Image
import numpy as np


def load_image(blob):
    image = blob_to_image(blob)
    image = image_to_array(image)
    return image


def image_to_array(image, new_size=(320, 320)):
    image = image.resize(new_size)
    image = np.asarray(image, dtype=np.float32).reshape(-1, 3)

    return image


def blob_to_image(blob):
    image = Image.open(blob.stream)
    image = image.convert("RGB")

    return image

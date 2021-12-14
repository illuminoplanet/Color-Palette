from PIL import Image
import numpy as np


def load_image(filepath, new_size=(320, 320)):
    image = Image.open(filepath)
    image = image.resize(new_size)
    image = np.asarray(image, dtype=np.float32).reshape(-1, 3)

    return image


def sRGBtoRGB(srgb):
    rgb = np.zeros_like(srgb, dtype=np.float32)
    srgb = srgb / 255
    mask = srgb <= 0.04045

    rgb[mask] = srgb[mask] / 12.92
    rgb[~mask] = ((srgb[~mask] + 0.055) / 1.055) ^ 2.4

    return rgb


if __name__ == "__main__":
    srgb = load_image("./image.jpg")
    print(srgb[0])
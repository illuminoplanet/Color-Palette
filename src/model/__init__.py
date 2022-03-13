from .clustering import *
from .image_processing import *


def get_color_pallete(blob):
    # Convert data uri to numpy array
    image = load_image(blob)

    # Get color pallete
    image = srgb_to_lab(image)
    color_pallete = MiniBatchKMeans().get_repr_value(
        image, k=5, params={"n_iter": 100, "batch_size": 1024}
    )
    color_pallete = lab_to_hex(color_pallete)

    return color_pallete

from PIL import Image
import numpy as np


def load_image(filepath, new_size=(320, 320)):
    """
    Load image from given file path

    Parameters
    ----------
    filepath : str
        Image file path 
    new_sie : tuple(int, int)
        New size of image

    Returns
    -------
    image : np.array(dtype=np.float32)
        Loaded image
    """

    image = Image.open(filepath)
    image = image.resize(new_size)
    image = np.asarray(image, dtype=np.float32).reshape(-1, 3)

    return image

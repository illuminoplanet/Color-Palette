import numpy as np


def srgb_to_lab(srgb):
    rgb = srgb_to_rgb(srgb)
    xyz = rgb_to_xyz(rgb)
    lab = xyz_to_lab(xyz)

    return lab


def srgb_to_rgb(srgb):
    """
    Converts sRGB to linear RGB
    https://en.wikipedia.org/wiki/SRGB

    Parameters
    ----------
    srgb : np.array(dtype=np.float32)
        Colors represented in standard RGB (sRGB) color space

    Returns
    -------
    rgb : np.array(dtype=np.float32)
        Colors represented in linear RGB
    """

    rgb = np.zeros_like(srgb, dtype=np.float32)
    srgb = srgb / 255
    mask = srgb <= 0.04045

    rgb[mask] = srgb[mask] / 12.92
    rgb[~mask] = ((srgb[~mask] + 0.055) / 1.055) ** 2.4

    return rgb


def rgb_to_xyz(rgb):
    """
    Converts linear RGB to XYZ
    https://en.wikipedia.org/wiki/SRGB

    Parameters
    ----------
    rgb : np.array(dtype=np.float32)
        Colors represented in linear RGB color space

    Returns
    -------
    xyz : np.array(dtype=np.float32)
        Colors represented in XYZ color space
    """
    m = np.array(
        [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]]
    )
    xyz = np.dot(m, rgb.T).T * 100

    return xyz


def xyz_to_lab(xyz):
    """
    Converts XYZ to L*a*b
    https://en.wikipedia.org/wiki/CIELAB_color_space

    Parameters
    ----------
    xyz : np.array(dtype=np.float32)
        Colors represented in XYZ color space
    Returns
    -------
    lab : np.array(dtype=np.float32)
        Colors represented in L*a*b color space
    """

    delta = 6 / 29

    def f(t):
        mask = t > delta ** 3
        new = np.zeros_like(t)

        new[mask] = np.cbrt(t[mask])
        new[~mask] = t[~mask] / (3 * delta ** 2) + (4 / 29)
        return new

    lab = np.zeros_like(xyz, dtype=np.float32)
    temp = f(xyz / np.array([95.0489, 100.0, 108.8840]))

    lab[:, 0] = 116 * temp[:, 1] - 16
    lab[:, 1] = 500 * (temp[:, 0] - temp[:, 1])
    lab[:, 2] = 200 * (temp[:, 1] - temp[:, 2])

    return lab

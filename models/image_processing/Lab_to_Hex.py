import numpy as np


def LabtoXYZ(lab):
    """
    Converts L*a*b to XYZ
    https://en.wikipedia.org/wiki/CIELAB_color_space

    Parameters
    ----------
    lab : np.array(dtype=np.float32)
        Colors represented in L*a*b color space
    Returns
    -------
    xyz : np.array(dtype=np.float32)
        Colors represented in XYZ color space
    """

    delta = 6 / 29

    def f_inverse(t):
        mask = t > delta
        new = np.zeros_like(t)

        new[mask] = t[mask] ** 3
        new[~mask] = 3 * (delta ** 2) * (t[~mask] - (4 / 29))
        return new

    xyz = np.zeros_like(lab, dtype=np.float32)
    temp = (lab + np.array([16.0, 0.0, 0.0])) / np.array([116.0, 500.0, 200.0])

    xyz[:, 0] = f_inverse(temp[:, 0] + temp[:, 1])
    xyz[:, 1] = f_inverse(temp[:, 0])
    xyz[:, 2] = f_inverse(temp[:, 0] - temp[:, 2])
    xyz *= np.array([95.0489, 100.0, 108.8840])

    return xyz


def XYZtoRGB(xyz):
    """
    Converts XYZ to linear RGB 
    https://en.wikipedia.org/wiki/SRGB

    Parameters
    ----------
    xyz : np.array(dtype=np.float32)
        Colors represented in XYZ color space

    Returns
    -------
    rgb : np.array(dtype=np.float32)
        Colors represented in linear RGB color space
    """

    m = np.array(
        [
            [3.2406, -1.5372, -0.4986],
            [-0.9689, 1.8758, 0.0415],
            [0.0557, -0.2040, 1.0570],
        ]
    )
    rgb = np.dot(m, xyz.T).T / 100

    return rgb


def RGBtosRGB(rgb):
    """
    Converts linear RGB to sRGB
    https://en.wikipedia.org/wiki/SRGB

    Parameters
    ----------
    rgb : np.array(dtype=np.float32)
        Colors represented in linear RGB

    Returns
    -------
    srgb : np.array(dtype=np.float32)
        Colors represented in standard RGB (sRGB) color space
    """

    srgb = np.zeros_like(rgb, dtype=np.float32)
    mask = rgb <= 0.0031308

    srgb[mask] = rgb[mask] * 12.92
    srgb[~mask] = (rgb[~mask] ** (1 / 2.4)) * 1.055 - 0.055
    srgb *= 255

    return srgb


def sRGBtoHex(srgb):
    """
    Converts sRGB to Hex

    Parameters
    ----------
    srgb : np.array(dtype=np.float32)
        Colors represented in standard RGB (sRGB) color space

    Returns
    -------
    hexa : list[str]
        Colors represented in Hex
    """

    srgb = srgb.astype(np.uint8)
    hexa = [f"#{color[0]:02x}{color[1]:02x}{color[2]:02x}" for color in srgb]
    return hexa


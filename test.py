from clustering import *
from image_processing import *


if __name__ == "__main__":
    srgb = load_image("./image.jpg")

    print(
        MiniBatchKMeans().get_repr_value(
            srgb, 4, params={"n_iter": 200, "batch_size": 1024}
        )
    )
    print(KMeans().get_repr_value(srgb, 4, params={"n_iter": 200}))


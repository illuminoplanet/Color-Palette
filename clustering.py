import numpy as np
from process_image import load_image


class KMeans:
    def get_repr_value(self, data, k, n_iter=200):
        centroid, _ = self._cluster(data, k, n_iter)
        return centroid

    def _cluster(self, data, k, n_iter):
        centroid = data[:k]

        for i in range(1):
            cluster = self._assign_centroid(data, centroid)
            centroid = self._update_centroid(cluster)

        return centroid, cluster

    def _assign_centroid(self, data, centroid):
        get_closest = lambda x: np.argmin(self._get_distance(centroid, x))
        cluster_idx = np.apply_along_axis(get_closest, axis=1, arr=data)

        cluster = []
        for i in range(centroid.shape[0]):
            cluster.append(data[cluster_idx == i])
        return cluster

    def _update_centroid(self, cluster):
        new_centroid = np.array([np.mean(c, axis=0) for c in cluster], dtype=np.float32)
        return new_centroid

    def _get_distance(self, x1, x2, ord=2):
        return np.linalg.norm(x1 - x2, ord=ord, axis=1)


if __name__ == "__main__":
    srgb = load_image("./image.jpg")

    k_means = KMeans()
    centroid = k_means.get_repr_value(srgb, 3, n_iter=10)

    print(centroid)

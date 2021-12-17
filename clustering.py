import numpy as np
from process_image import load_image


class KMeans:
    def get_repr_value(self, data, k, n_iter=200):
        centroid, _ = self._cluster(data, k, n_iter)
        return centroid

    def _cluster(self, data, k, n_iter):
        centroid = data[:k]

        for i in range(n_iter):
            cluster = self._assign_centroid(data, centroid)
            centroid, done = self._update_centroid(centroid, cluster)
            if done:
                break

        return centroid, cluster

    def _assign_centroid(self, data, centroid):
        get_closest = lambda x: np.argmin(self._get_distance(centroid, x))
        cluster_idx = np.apply_along_axis(get_closest, axis=1, arr=data)

        cluster = []
        for i in range(centroid.shape[0]):
            cluster.append(data[cluster_idx == i])
        return cluster

    def _update_centroid(self, centroid, cluster):
        new_centroid = np.array([np.mean(c, axis=0) for c in cluster], dtype=np.float32)
        done = np.mean(self._get_distance(new_centroid, centroid)) < 0.5

        return new_centroid, done

    def _get_distance(self, x1, x2, ord=2):
        return np.linalg.norm(x1 - x2, ord=ord, axis=1)


class MiniBatchKMeans(KMeans):
    def get_repr_value(self, data, k, n_iter=200, batch_size=1024):
        centroid, _ = self._cluster(data, k, n_iter, batch_size)
        return centroid

    def _cluster(self, data, k, n_iter, batch_size):
        centroid = data[:k]
        data_size = data.shape[0]

        for i in range(n_iter):
            batch = data[np.random.choice(data_size, batch_size)]
            cluster = self._assign_centroid(batch, centroid)
            centroid, done = self._update_centroid(centroid, cluster)
            if done:
                break

        return centroid, cluster


if __name__ == "__main__":
    srgb = load_image("./image.jpg")

    print(MiniBatchKMeans().get_repr_value(srgb, 4))
    print(KMeans().get_repr_value(srgb, 4))


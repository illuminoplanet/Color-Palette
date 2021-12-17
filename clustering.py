import numpy as np
from process_image import load_image


class KMeans:
    """
    K-Means clustering algorithm 
    https://en.wikipedia.org/wiki/K-means_clustering
    """

    def get_repr_value(self, data, k, n_iter=200):
        """
        Gets k representative values from data

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to extract representative values from 
        k : int
            Number of representative values to extract
        n_iter : int
            Number of iterations in K-Means clustering process

        Returns
        -------
        repr_value : np.array(dtype=np.float32)
            Extracted representative values 
        """

        repr_value, _ = self._cluster(data, k, n_iter)
        return repr_value

    def _cluster(self, data, k, n_iter):
        """
        Cluster the data in k classes using K-Means algorithm 

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to cluster
        k : int
            Number of clusters
        n_iter : int
            Number of iterations in K-Means clustering process

        Returns
        -------
        centroid : np.array(dtype=np.float32)
            Centroid of each cluster
        cluster : list[np.array(dtype=np.float32)]
            Clusters
        """

        # Initialize centroids with first k samples
        centroid = data[:k]

        for i in range(n_iter):
            # Assign each data to closest centroid
            cluster = self._assign_centroid(data, centroid)
            # Update the centroids with current cluster center
            centroid, done = self._update_centroid(centroid, cluster)
            # If update size is within tolerance range, early terminate the loop
            if done:
                break

        return centroid, cluster

    def _assign_centroid(self, data, centroid):
        """
        Assign each data to closest centroid

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to cluster
        centroid : np.array(dtype=np.float32)
            Centroids of previous cluster

        Returns
        -------
        repr_value : np.array(dtype=np.float32)
            Extracted representative values 
        """

        # Returns index of closest centroid from each data
        get_closest = lambda x: np.argmin(self._get_distance(centroid, x))
        cluster_idx = np.apply_along_axis(get_closest, axis=1, arr=data)

        # Seperate data by closest centroid, form new clusters
        cluster = []
        for i in range(centroid.shape[0]):
            cluster.append(data[cluster_idx == i])
        return cluster

    def _update_centroid(self, centroid, cluster):
        """
        Returns new centroids calculated from clusters 

        Parameters
        ----------
        centroid : np.array(dtype=np.float32)
            Old centroids
        cluster : list[np.array(dtype=np.float32)]
            Clusters

        Returns
        -------
        new_centroid : np.array(dtype=np.float32)
            Newly calculated centroids
        done : bool
            Is update size is within tolerance range
        """
        new_centroid = np.array([np.mean(c, axis=0) for c in cluster], dtype=np.float32)
        done = np.mean(self._get_distance(new_centroid, centroid)) < 0.1

        return new_centroid, done

    def _get_distance(self, x1, x2):
        """
        Return euclidean distance between x1 and x2

        Parameters
        ----------
        x1 : np.array(dtype=np.float32)
            First data 
        x2 : np.array(dtype=np.float32)
            Second data 

        Returns
        -------
        dist : float
            Euclidean distance between x1 and x2
        """

        dist = np.linalg.norm(x1 - x2, ord=2, axis=1)
        return dist


class MiniBatchKMeans(KMeans):
    def get_repr_value(self, data, k, n_iter=200, batch_size=1024):
        """
        Gets k representative values from data

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to extract representative values from 
        k : int
            Number of representative values to extract
        n_iter : int
            Number of iterations in MiniBatch K-Means clustering process
        batch_size : int
            Size of minibatch 
        
        Returns
        -------
        repr_value : np.array(dtype=np.float32)
            Extracted representative values 
        """
        repr_value, _ = self._cluster(data, k, n_iter, batch_size)
        return repr_value

    def _cluster(self, data, k, n_iter, batch_size):
        """
        Cluster the data in k classes using MiniBatch K-Means algorithm 

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to cluster
        k : int
            Number of clusters
        n_iter : int
            Number of iterations in K-Means clustering process
        batch_size : int    
            Size of minibatch 

        Returns
        -------
        centroid : np.array(dtype=np.float32)
            Centroid of each cluster
        cluster : list[np.array(dtype=np.float32)]
            Clusters
        """
        centroid = data[:k]
        data_size = data.shape[0]

        for i in range(n_iter):
            # Create minibatch of size batch_size from data
            batch = data[np.random.choice(data_size, batch_size)]
            # Assign each data to closest centroid
            cluster = self._assign_centroid(batch, centroid)
            # Update the centroids with current cluster center
            centroid, done = self._update_centroid(centroid, cluster)
            # If update size is within tolerance range, early terminate the loop
            if done:
                break

        return centroid, cluster


if __name__ == "__main__":
    srgb = load_image("./image.jpg")

    print(MiniBatchKMeans().get_repr_value(srgb, 4))
    print(KMeans().get_repr_value(srgb, 4))


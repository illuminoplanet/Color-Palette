import numpy as np
from .clustering import Clustering


class KMeans(Clustering):
    """
    K-Means clustering algorithm 
    https://en.wikipedia.org/wiki/K-means_clustering
    """

    def _cluster(self, data, k, params):
        """
        Cluster the data in k classes using K-Means algorithm 

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to cluster
        k : int
            Number of clusters
        params : int
            Parameters of K-means clustering algorithm

        Returns
        -------
        centroid : np.array(dtype=np.float32)
            Centroid of each cluster
        cluster : list[np.array(dtype=np.float32)]
            Clusters
        """

        # Initialize centroids with first k samples
        centroid = data[:k]
        n_iter = params["n_iter"]

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


class MiniBatchKMeans(KMeans):
    def _cluster(self, data, k, params):
        """
        Cluster the data in k classes using MiniBatch K-Means algorithm 

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to cluster
        k : int
            Number of clusters
        params : int
            Parameters of MiniBatch K-means clustering algorithm

        Returns
        -------
        centroid : np.array(dtype=np.float32)
            Centroid of each cluster
        cluster : list[np.array(dtype=np.float32)]
            Clusters
        """
        centroid = data[:k]
        data_size = data.shape[0]
        n_iter = params["n_iter"]
        batch_size = params["batch_size"]

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

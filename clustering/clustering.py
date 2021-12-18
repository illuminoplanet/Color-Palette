from abc import ABCMeta, abstractmethod
import numpy as np


class Clustering(metaclass=ABCMeta):
    def get_repr_value(self, data, k, params=None):
        """
        Gets k representative values from data

        Parameters
        ----------
        data : np.array(dtype=np.float32)
            Data to extract representative values from 
        k : int
            Number of representative values to extract
        params : dict
            Parameters of clustering algorithm

        Returns
        -------
        repr_value : np.array(dtype=np.float32)
            Extracted representative values 
        """

        repr_value, _ = self._cluster(data, k, params)
        return repr_value

    @abstractmethod
    def _cluster(self, data, k, params):
        pass

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


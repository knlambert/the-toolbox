# coding: utf-8
from abc import ABCMeta, abstractmethod


class AbstractMailIO(object):
    """
    Abstract task for mail communication.
    """
    __metaclass__ = ABCMeta

    def __init__(self):
        pass
    
    @abstractmethod
    def send(self, subject, message):
        """
        Send an email.
        Args:
            subject (unicode): The subject of the email.
            message (unicode): The message in the email. HTML Like.
        """
        pass

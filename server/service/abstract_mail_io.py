# coding: utf-8
from abc import ABCMeta, abstractmethod


class AbstractNotificationIO(object):
    """
    Abstract task for notification communication.
    """
    __metaclass__ = ABCMeta

    def __init__(self, config):
        self._config = config
        self._simulation = config[u"SIMULATION"]
    
    @abstractmethod
    def notify(self, recipient, subject, message):
        """
        Send an email.
        Args:
            recipient (list of unicode): The person who will receive the message.
            subject (unicode): The subject of the email.
            message (unicode): The message in the email. HTML Like.
        """
        pass

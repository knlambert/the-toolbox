# coding: utf-8
import smtplib
import logging
from email.MIMEText import MIMEText
from email.MIMEMultipart import MIMEMultipart
from .abstract_mail_io import AbstractNotificationIO

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(logging.INFO)

class StandardMailIO(AbstractNotificationIO):
    """
    Standard mail service.
    """
    def notify(self, recipient, subject, message):
        """
        Send an email.
        Args:
            recipient (list of unicode): The person who will receive the message.
            subject (unicode): The subject of the email.
            message (unicode): The message in the email. HTML Like.
        """
        if type(recipient) is unicode:
            recipient = [recipient]
        recipient = ", ".join(recipient)
        if not self._config[u"SIMULATION"]:
            smtp_config = self._config[u"SMTP"]
            msg = MIMEMultipart()
            msg['From'] = smtp_config[u'email']
            msg['To'] = recipient
            msg['Subject'] = subject
            msg.attach(MIMEText(message, 'html'))
            server = smtplib.SMTP(smtp_config[u'host'], smtp_config[u'port'])
            server.starttls()
            server.login(smtp_config[u'email'], smtp_config[u'password'])
            server.sendmail(smtp_config[u'email'], recipient, msg.as_string())
            server.quit()
        else:
            LOGGER.info(u"* SIMULATION : Sending notification.")
            LOGGER.info(u"* To : {}".format(recipient))
            LOGGER.info(u"* Subject : {}".format(subject))
            LOGGER.info(u"* Message : {}".format(message))




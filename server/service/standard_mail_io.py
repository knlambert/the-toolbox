# coding: utf-8
import smtplib
from email.MIMEText import MIMEText
from email.MIMEMultipart import MIMEMultipart
from .abstract_mail_io import AbstractNotificationIO

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



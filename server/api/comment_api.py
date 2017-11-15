# coding: utf-8
from pyrestdbapi.api import Api


class CommentApi(Api):
    """
    Reimplements the CommentApi to add some custom features.
    """

    def __init__(self, db, notification_io, notification_config):
        """
        Constructs the taks API.
        Args:
            db (DB): Client class to communicate with DB.
            notification_io (AbstractNotificationIO): A service to notify persons.
            notification_config (dict): The configuration for mail messages.
        """
        Api.__init__(
            self,
            db=db,
            default_table_name=u"comment"
        )
        self._notification_io = notification_io
        self._notification_config = notification_config
        self._comment_notification = db.comment_notification
        self._user = db.user

    def create(self, document, lookup=None, auto_lookup=None):
        """
        Delete item(s).
        Args:
            filters (dict): Filter to know what to delete.
            update (dict): Fields to update.
            lookup (list of dict): Lookup option (joins).
            auto_lookup (int): Let the database construct the lookups (value is the deep).
        Returns:
            (dict): The result of the deletion (with number of items deleted).
        """
        result = Api.create(self, document, lookup, auto_lookup)

        if self._notification_config.get(u"ACTIVE", False):
            notifications = list(self._comment_notification.find(query={
                u"TASK_ID": document[u"task"],
                u"USER_ID": {
                    u"$ne": document[u"author"][u'id']
                }
            }))
            
            if len(notifications) > 0:
                common_notification = notifications[0]
                common_notification[u"TASK_LINK"] = u"{}/{}".format(self._notification_config[u"APP_URL"], common_notification[u"TASK_LINK"])
                common_notification[u"AUTHOR_MAIL"] = document[u"author"][u'email']
                common_notification[u"AUTHOR_NAME"] = document[u"author"][u'name']

                recipient_emails = [
                    notif[u"USER_EMAIL"]
                    for notif in notifications
                ] + [common_notification[u"TASK_AUTHOR_EMAIL"]]

                # If comment writer is in recipients, remove it.
                recipient_emails = [
                    email
                    for email in recipient_emails
                    if email != common_notification[u"AUTHOR_MAIL"]
                ]

                self._notification_io.notify(
                    recipient=list(set(recipient_emails)),
                    subject=self._notification_config[u"COMMENT_ADDED"][u"SUBJECT"] % common_notification,
                    message=self._notification_config[u"COMMENT_ADDED"][u"MESSAGE"] % common_notification
                )
            
        return result

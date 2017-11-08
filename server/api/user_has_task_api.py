# coding: utf-8
from pyrestdbapi.api import Api


class UserHasTaskApi(Api):
    """
    Reimplements the UserHasTaskApi to add some custom features.
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
            default_table_name=u"user_has_task"
        )
        self._task_notification = db.task_notification
        self._notification_io = notification_io
        self._notification_config = notification_config

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
            user_email = document['user']['email']
            task_id = document[u"task"][u"id"]

            task = list(self._task_notification.find({
                u"TASK_ID": document[u"task"][u"id"]
            }))[0]
            task[u"TASK_LINK"] = u"{}/{}".format(self._notification_config[u"APP_URL"], task[u"TASK_LINK"])
            self._notification_io.notify(
                recipient=user_email, 
                subject=(self._notification_config[u"USER_AFFECTED"][u"SUBJECT"] % task),
                message=(self._notification_config[u"USER_AFFECTED"][u"MESSAGE"] % task)
            )

        return result

        

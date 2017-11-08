# coding: utf-8
import logging
from pyrestdbapi.api import Api


LOGGER = logging.getLogger(__name__)

class TaskApi(Api):
    """
    Reimplements the TaskApi to add some custom features.
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
            default_table_name=u"task"
        )
        self._notification_io = notification_io
        self._notification_config = notification_config
        self._task_status_change_notification = db.task_status_change_notification

    def update_id(self, document_id, update, lookup=None, auto_lookup=None):
        """
        Delete item(s).
        Args:
            id (int): The ID of the document to update.
            update (dict): Fields to update.
            lookup (list of dict): Lookup option (joins).
            auto_lookup (int): Let the database construct the lookups (value is the deep).
        Returns:
            (dict): The result of the deletion (with number of items deleted).
        """
        
        old_task = self.get(document_id, lookup, auto_lookup)
        new_task = Api.update_id(self, document_id, update, lookup, auto_lookup)

        if self._notification_config.get(u"ACTIVE", False) and old_task[u"completed"] != new_task[u"completed"]:
            notifications = list(self._task_status_change_notification.find(query={
                u"TASK_ID": document_id
            }))
        
            common_task_notification = notifications[0]

            recipients = [
                item[u"USER_EMAIL"] 
                for item in notifications if item[u"USER_EMAIL"] is not None
            ]

            if common_task_notification[u"AUTHOR_EMAIL"] not in recipients:
                recipients.append(common_task_notification[u"AUTHOR_EMAIL"])

            common_task_notification[u"TASK_LINK"] = u"{}/{}".format(self._notification_config[u"APP_URL"], common_task_notification[u"TASK_LINK"])

            OPERATION = u"TASK_REOPENED" if not new_task[u"completed"] else u"TASK_CLOSED"

            self._notification_io.notify(
                recipient=recipients, 
                subject=(self._notification_config[OPERATION][u"SUBJECT"] % common_task_notification),
                message=(self._notification_config[OPERATION][u"MESSAGE"] % common_task_notification)
            )
            

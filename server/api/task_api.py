# coding: utf-8
from pyrestdbapi.api import Api


class TaskApi(Api):
    """
    Reimplements the TaskApi to add some custom features.
    """

    def __init__(self, db):
        """
        Constructs the taks API.
        Args:
            db (DB): Client class to communicate with DB.
        """
        Api.__init__(
            self,
            db=db,
            default_table_name=u"task"
        )

    def update(self, filters, update, lookup=None, auto_lookup=None):
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
        result = Api.update(self, filters, update, lookup=None, auto_lookup=None)
        return result

        

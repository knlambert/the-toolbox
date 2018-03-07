# coding: utf-8

import os
import fnmatch
import logging
import user_api
from config import CONFIG
from dbapi import DBApi
from server.api.task_api import TaskDBApi
from sqlcollection.client import Client
from server.api.comment_api import CommentDBApi
from flask import Flask, send_from_directory, send_file
from server.api.user_has_task_api import UserHasTaskDBApi
from server.service.standard_mail_io import StandardMailIO
from notification_config import NOTIFICATION_CONFIG

formatter = logging.Formatter(u'%(message)s')
logger = logging.getLogger()

if not logger.handlers:
    handler = logging.StreamHandler()
else:
    handler = logger.handlers[0]

handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# create flask server
APP = Flask(__name__)

# Init & register User API
USER_API = user_api.UserApi(**CONFIG[u"user-api"])
FLASK_USER_API = USER_API.get_flask_adapter()
USER_API_BLUEPRINT = FLASK_USER_API.construct_blueprint()

# Init & register DB API
DB_API_CONF = CONFIG[u"db-api"]

CLIENT = Client(DB_API_CONF.get(u"unix_socket"))
DB = getattr(CLIENT, DB_API_CONF[u"db_name"])

MAIL_IO = StandardMailIO(NOTIFICATION_CONFIG) 

DB_API_CONFIG = {
    u"projects": DBApi(DB, u"project"),
    u"clients": DBApi(DB, u"client"),
    u"hours": DBApi(DB, u"hour"),
    u"project_assignements": DBApi(DB, u"project_assignement"),
    u"_users": DBApi(DB, u"_user"),
    u"task-lists": DBApi(DB, u"task_list"),
    u"tasks": TaskDBApi(DB, MAIL_IO, NOTIFICATION_CONFIG),
    u"comments": CommentDBApi(DB, MAIL_IO, NOTIFICATION_CONFIG),
    u"tags": DBApi(DB,u"tag"),
    u"task-tags": DBApi(DB, u"task_has_tag"),
    u"clients_affected_to_users": DBApi(DB, u"clients_affected_to_users"),
    u"project_consumption": DBApi(DB, u"project_consumption"),
    u"project_consumption_per_user": DBApi(DB, u"project_consumption_per_user"),
    u"project-loads": DBApi(DB, u"project_load"),
    u"cras": DBApi(DB, u"cra"),
    u"roles": DBApi(DB, u"role"),
    u"project_files": DBApi(DB, u"project_file"),
    u"task-assignements": UserHasTaskDBApi(DB, MAIL_IO, NOTIFICATION_CONFIG),
    u"tasks-sum-up": DBApi(DB, u"task_sum_up"),
    u"tasks-left": DBApi(DB, u"tasks_left")
}

for service_name, db_api in list(DB_API_CONFIG.items()):
    db_blueprint = db_api.get_flask_adapter(FLASK_USER_API).construct_blueprint()

    @db_blueprint.errorhandler(user_api.ApiException)
    def user_api_error_wrapper(exception):
        return flask_user_api.api_error_handler(exception)

    @db_blueprint.before_request
    @FLASK_USER_API.is_connected(login_url=u"/login")
    def is_connected():
        pass

    APP.register_blueprint(
        db_blueprint,
        url_prefix=u'/api/db/{}'.format(service_name)
    )



# App routes.

@APP.route('/<path:path>')
def send_client(path):
    """
    Handles client resources.
    """
    return send_from_directory('dist/', path)

@APP.errorhandler(404)
def send_index(e):
    """
    Redirect to client index file if not found.
    """
    return send_file("dist/index.html")



# Finally register the User API blueprint
APP.register_blueprint(USER_API_BLUEPRINT, url_prefix=u"/api/users")
if __name__ == "__main__":
    APP.run(threaded=True, host=u"0.0.0.0", debug=True)

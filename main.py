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

# Configs
DB_API_CONF = CONFIG[u"db-api"]
USER_API_CONFIG = CONFIG[u"user-api"]



# Init & register DB API

CLIENT = Client(DB_API_CONF.get(u"unix_socket"))
DB = getattr(CLIENT, DB_API_CONF[u"db_name"])

MAIL_IO = StandardMailIO(NOTIFICATION_CONFIG) 

def on_user_created(user):
    """
    Called when a user is created in the API.
    """
    DB._user.insert_one({
        u"email": user.get(u"email"),
        u"name": user.get(u"name"),
        u"min_hours_per_week": 40,
        u"default_role": 1
    })

def on_user_updated(user):
    """
    Called when a user is updated in the API.
    """
    DB._user.update_many({
            "email": user.get(u"email")
        }, {
            u"$set": {
                u"name": user.get(u"name")
            }
        }
    )

# Init & register User API
# Create user api object
USER_API =  user_api.create_user_api(
    db_url=u"mysql://{}:{}@{}/{}".format(
        USER_API_CONFIG.get(u"db_user"),
        USER_API_CONFIG.get(u"db_passwd"),
        USER_API_CONFIG.get(u"db_host"),
        USER_API_CONFIG.get(u"db_name")
    ),
    jwt_secret=USER_API_CONFIG.get(u"jwt_secret"),
    jwt_lifetime=USER_API_CONFIG.get(u"jwt_lifetime"),
    user_created_callback=on_user_created,
    user_updated_callback=on_user_updated
)

FLASK_USER_API = USER_API.get_flask_user_api()

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

    FLASK_USER_API.add_api_error_handler(db_blueprint)

    @db_blueprint.before_request
    @FLASK_USER_API.is_connected(login_url=u"/login")
    def is_connected():
        pass

    APP.register_blueprint(
        db_blueprint,
        url_prefix=u'/api/db/{}'.format(service_name)
    )

# App routes.
@APP.route(u'/<path:path>')
def send_client(path):
    """
    Handles client resources.
    """
    return send_from_directory(u'dist/', path)

@APP.errorhandler(404)
def send_index(e):
    """
    Redirect to client index file if not found.
    """
    return send_file("dist/index.html")

# Register the blueprint
APP.register_blueprint(FLASK_USER_API.construct_user_api_blueprint(), url_prefix=u"/api/users")
APP.register_blueprint(FLASK_USER_API.construct_role_api_blueprint(), url_prefix=u"/api/roles")

if __name__ == "__main__":
    APP.run(threaded=True, host=u"0.0.0.0", debug=True)

# coding: utf-8

import os
import fnmatch
from config import CONFIG
from user_api.user_api import UserApi
from user_api.flask_user_api import FlaskUserApi
from flask import Flask, send_from_directory, send_file
from pyrestdbapi.api import Api
from pyrestdbapi.db_api_blueprint import FlaskRestDBApi
from pysqlcollection.client import Client

# create flask server
APP = Flask(__name__)

# Init & register User API
USER_API = UserApi(**CONFIG[u"user-api"])
FLASK_USER_API = FlaskUserApi(USER_API)
USER_API_BLUEPRINT = FLASK_USER_API.construct_blueprint()

# Init & register DB API
DB_API_CONF = CONFIG[u"db-api"]

CLIENT = Client( 
    unix_socket=DB_API_CONF.get(u"db_unix_socket"),
    host=DB_API_CONF.get(u"db_host"),
    user=DB_API_CONF[u"db_user"],
    password=DB_API_CONF[u"db_password"]
)
DB = getattr(CLIENT, DB_API_CONF[u"db_name"])

DB_REST_API_CONFIG = {
    u"projects": Api(DB, default_table_name=u"project"),
    u"clients": Api(DB, default_table_name=u"client"),
    u"hours": Api(DB, default_table_name=u"hour"),
    u"project_assignements": Api(DB, default_table_name=u"project_assignement"),
    u"users": Api(DB, default_table_name=u"user"),
    u"task-lists": Api(DB, default_table_name=u"task_list"),
    u"tasks": Api(DB, default_table_name=u"task"),
    u"comments": Api(DB, default_table_name="comment"),
    u"clients_affected_to_users": Api(DB, default_table_name=u"clients_affected_to_users"),
    u"project_consumption": Api(DB, default_table_name=u"project_consumption"),
    u"project_consumption_per_user": Api(DB, default_table_name=u"project_consumption_per_user"),
    u"project-loads": Api(DB, default_table_name=u"project_load"),
    u"cras": Api(DB, default_table_name=u"cra"),
    u"roles": Api(DB, default_table_name=u"role"),
    u"project_files": Api(DB, default_table_name=u"project_file"),
    u"task-assignements": Api(DB, default_table_name=u"user_has_task"),
    u"tasks-sum-up": Api(DB, default_table_name=u"task_sum_up")
}

DB_FLASK_API = FlaskRestDBApi(DB_REST_API_CONFIG)
DB_API_BLUEPRINT = DB_FLASK_API.construct_blueprint()

# App routes.
INDEX_FILE = None
for f in os.listdir('./dist'):
    if fnmatch.fnmatch(f, 'dev-index.html') or fnmatch.fnmatch(f, '*index-*.html'):
        INDEX_FILE = u"/".join([u"dist", f])

@APP.route('/assets/<path:path>')
def send_assets(path):
    """
    Handle assets.
    """
    return send_from_directory('assets/', path)

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
    return send_file(INDEX_FILE)

@DB_API_BLUEPRINT.before_request
@FLASK_USER_API.is_connected(login_url="/login")
def is_connected():
    pass

# Finally register the Db API blueprint
APP.register_blueprint(DB_API_BLUEPRINT, url_prefix=u"/api/db")
APP.register_blueprint(USER_API_BLUEPRINT, url_prefix=u"/api/users")
if __name__ == "__main__":
    APP.run(threaded=True, host=u"0.0.0.0", debug=True)

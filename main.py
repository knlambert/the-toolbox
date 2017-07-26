# coding: utf-8

import os
import fnmatch
import MySQLdb
from config import CONFIG
from user_api.user_api import UserApi
from user_api.flask_user_api import FlaskUserApi
from db_api.builder import build_db_api
from db_api.flask_db_api import FlaskDBApi
from flask import Flask, send_from_directory, send_file

# create flask server
APP = Flask(__name__)

# Init & register User API
USER_API = UserApi(**CONFIG[u"user-api"])
FLASK_USER_API = FlaskUserApi(USER_API)
USER_API_BLUEPRINT = FLASK_USER_API.construct_blueprint()


# Init & register DB API
DB_API_CONF = CONFIG[u"db-api"]
DB_API_CONF[u"db_api_def"] = MySQLdb

DB_API = build_db_api(**DB_API_CONF)
FLASK_DB_API = FlaskDBApi(DB_API)
DB_API_BLUEPRINT = FLASK_DB_API.construct_blueprint()

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
@FLASK_USER_API.is_connected
def is_connected():
    pass

# Finally register the Db API blueprint
APP.register_blueprint(DB_API_BLUEPRINT, url_prefix=u"/api/db")
APP.register_blueprint(USER_API_BLUEPRINT, url_prefix=u"/api/user")
if __name__ == "__main__":
    APP.run(threaded=True, host=u"0.0.0.0", debug=True)

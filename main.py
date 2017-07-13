# coding: utf-8

import re
import os
import json
import base64
import fnmatch
import MySQLdb
from config import CONFIG
from urlparse import urlparse
from user_api.user_api import UserApi 
from user_api.flask_user_api import FlaskUserApi 
from db_api.blueprint import construct_db_api_blueprint
from flask import Flask, request, jsonify, send_from_directory, send_file, redirect

# create flask server
APP = Flask(__name__)

# Init & register User API
USER_API = UserApi(**CONFIG[u"user-api"])
FLASK_USER_API = FlaskUserApi(USER_API)
USER_API_BLUEPRINT = FLASK_USER_API.construct_blueprint()

# Init & register DB API
DB_API_CONF = CONFIG[u"db-api"]
DB_API_BLUEPRINT = construct_db_api_blueprint(
    db_driver=MySQLdb,
    db_host=DB_API_CONF[u"db_host"],
    db_user=DB_API_CONF[u"db_user"],
    db_passwd=DB_API_CONF[u"db_passwd"],
    db_name=DB_API_CONF[u"db_name"]
)

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

# Finally register the Db API blueprint
APP.register_blueprint(DB_API_BLUEPRINT, url_prefix=u"/api/db")
APP.register_blueprint(USER_API_BLUEPRINT, url_prefix=u"/api/user")
if __name__ == "__main__":
    APP.run(threaded=True, host=u"0.0.0.0", debug=True)

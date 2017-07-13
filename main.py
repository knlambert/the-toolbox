# coding: utf-8

import MySQLdb
import re
import json
import base64
import fnmatch
import os
from urlparse import urlparse
from flask import Flask, request, jsonify, send_from_directory, send_file, redirect
from db_api.blueprint import construct_db_api_blueprint
from user_api.blueprint import construct_user_api_blueprint
from user_api.authentication import Authentication
from config import CONFIG

app = Flask(__name__)


# Entry point config
INDEX_FILE = None
for file in os.listdir('./dist'):
    if fnmatch.fnmatch(file, 'dev-index.html') or fnmatch.fnmatch(file, '*index-*.html'):
        INDEX_FILE = u"/".join([u"dist", file])

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('assets/', path)

@app.route('/<path:path>')
def send_client(path):
    return send_from_directory('dist/', path)

@app.errorhandler(404)
def send_index(e):
    print(INDEX_FILE)
    return send_file(INDEX_FILE)


USER_API_CONF = CONFIG[u"user-api"]

# Register User API blueprint
user_api_blueprint = construct_user_api_blueprint(
    db_driver=MySQLdb,
    db_host=USER_API_CONF[u"db_host"],
    db_user=USER_API_CONF[u"db_user"],
    db_passwd=USER_API_CONF[u"db_passwd"],
    db_name=USER_API_CONF[u"db_name"],
    jwt_secret=CONFIG[u"auth"][u"token"][u"secret"],
    jwt_lifetime=CONFIG[u"auth"][u"token"][u"lifetime"]
)

DB_API_CONF = CONFIG[u"db-api"]

# Register DB Api blueprint
db_api_blueprint = construct_db_api_blueprint(
    db_driver=MySQLdb,
    db_host=DB_API_CONF[u"db_host"],
    db_user=DB_API_CONF[u"db_user"],
    db_passwd=DB_API_CONF[u"db_passwd"],
    db_name=DB_API_CONF[u"db_name"]
)

# Use Authentication in a custom way, no need to connect to the db
auth = Authentication(
    jwt_secret=CONFIG[u"auth"][u"token"][u"secret"],
    jwt_lifetime=CONFIG[u"auth"][u"token"][u"lifetime"]
)


# Add a before request to the blue print
# @user_api_blueprint.before_request
@db_api_blueprint.before_request
def check_if_connected():
    # These two endpoint do not hae auth.
    if request.endpoint not in [u'user_api.user', u"user_api.check"]:
        if u"Authorization" in request.headers:
            authorization = request.headers.get(u"Authorization")
            m = re.search(u"Bearer (\S+)", authorization)
            token = m.group(1)
            if m is None or not auth.is_token_valid(token):
                return jsonify({
                    u"Message": u"Invalid token."
                }), 401
        elif u"credentials" in request.cookies:
            decoded = base64.b64decode(request.cookies.get('credentials'))
            credentials = json.loads(decoded)
            if not auth.is_token_valid(credentials.get('token')):
                return jsonify({
                    u"Message": u"Invalid token."
                }), 401
        else:
            return jsonify({
                u"Message": u"Unauthorized."
            }), 403



# Finally register the Db API blueprint
app.register_blueprint(db_api_blueprint, url_prefix=u"/api")
app.register_blueprint(user_api_blueprint, url_prefix=u"/api/user")
if __name__ == "__main__":
    app.run(threaded=True, host=u"0.0.0.0", debug=True)
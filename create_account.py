# coding: utf-8

from user_api.user_api import UserApi
from config import CONFIG
import MySQLdb

# Init DB Manager
USER_API = UserApi(**CONFIG[u"user-api"])
auth = USER_API.authentication
db_manager = USER_API.db_manager
salt = auth.generate_salt()
hash = auth.generate_hash(u"DummyPassword", salt)
db_manager.save_new_user(
    email=u"admin@myapp.net",
    name=u"Admin",
    hash=hash,
    salt=salt
)
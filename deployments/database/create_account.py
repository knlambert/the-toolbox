# coding: utf-8

from user_api.user_api import UserApi
import MySQLdb
import argparse

parser = argparse.ArgumentParser(description='Create a user in command line')
parser.add_argument('host', help='The MySQL host server')
parser.add_argument('user', help='The user to connect the DB.')
parser.add_argument('password', help='The password to connect the DB.')
parser.add_argument('jwt_secret', help='The jwt_secret the database is using.')

args = parser.parse_args()

# Init DB Manager
USER_API = UserApi(**{
    u"db_host": args.host,
    u"db_user": args.user,
    u"db_passwd": args.password,
    u"db_name": u"user_api",
    u"jwt_lifetime": 30 * 24 * 3600,
    u"jwt_secret": args.jwt_secret
})
auth = USER_API.authentication
db_manager = USER_API.db_manager
salt = auth.generate_salt()

email = raw_input(u'User to create email:')
name = raw_input(u'User to create name:')
password = raw_input(u'User to create passord:')

hash = auth.generate_hash(password, salt)
db_manager.save_new_user(
    email=email,
    name=name,
    hash=hash,
    salt=salt
)
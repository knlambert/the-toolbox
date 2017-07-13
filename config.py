# coding: utf-8
"""
This file contains the configuration of the application.
"""
CONFIG = {
    u"auth": {
        u"token": {
            u"lifetime": 30 * 24 * 3600,
            u"secret": u"DUMMY"
        }
    },
    u"user-api": {
        u"db_host": u"127.0.0.1",
        u"db_user": u"root",
        u"db_passwd": u"localroot1234",
        u"db_name": u"user_api"
    },
    u"db-api": {
        u"db_host": u"127.0.0.1",
        u"db_user": u"root",
        u"db_passwd": u"localroot1234",
        u"db_name": u"hours_count"
    }
}

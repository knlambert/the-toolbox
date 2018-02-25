# coding: utf-8
"""
This file contains the configuration of the application.
"""
CONFIG = {
    u"user-api": {
        u"db_host": u"127.0.0.1",
        u"db_user": u"root",
        u"db_passwd": u"localroot1234",
        u"db_name": u"user_api",
        u"jwt_lifetime": 30 * 24 * 3600,
        u"jwt_secret": u"DUMMY"
    },
    u"db-api": {
        u"unix_socket": u'mysql://root:localroot1234@127.0.0.1/',
        u"db_name": u"hours_count"
    }
}

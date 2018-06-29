# coding: utf-8
"""
This file contains the configuration of the application.
"""
CONFIG = {
    u"user-api": {
        u"db_url": "mysql+mysqldb://root:localroot1234@127.0.0.1/user_api?charset=utf8",
        u"jwt_lifetime": 30 * 24 * 3600,
        u"jwt_secret": u"DUMMY"
    },
    u"db-api": {
        u"unix_socket": u'mysql://root:localroot1234@127.0.0.1/',
        u"db_name": u"hours_count"
    }
}



USAGE="Usage ./tasks/build user_api_login user_api_password user_api_secret user_api_host db_api_login db_api_password db_api_host"

user_api_login=$1
user_api_password=$2
user_api_secret=$3
user_api_host=$4
db_api_login=$5
db_api_password=$6
db_api_host=$7

echo "Starting build ... "
rm -rf build && mkdir build
echo "Done"

echo "Compiling client ..."
# cd client/ && ng build --prod && cd ..
cp -r dist build/dist
echo "Done"

echo "Including server dependencies ..."
cp main.py build/
cp wsgi.py build/
cp config.py build/
cp notification_config.py build/
cp -r server build/server
cp -r requirements build/requirements
echo "Done"

echo "Modification of config files ..."
cd build
cat <<EOT > config.py
# coding: utf-8
"""
This file contains the configuration of the application.
"""
CONFIG = {
    u"user-api": {
        u"db_host": "$user_api_host",
        u"db_user": u"$user_api_login",
        u"db_passwd": u"$user_api_password",
        u"db_name": u"user_api",
        u"jwt_lifetime": 30 * 24 * 3600,
        u"jwt_secret": u"$user_api_secret"
    },
    u"db-api": {
        u"db_host": u"$db_api_host",
        u"db_user": u"$db_api_login",
        u"db_password": u"$db_api_password",
        u"db_name": u"hours_count"
    }
}
EOT



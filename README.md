# The-toolbox

<p align="center">
  <img src="https://user-images.githubusercontent.com/16439060/33559904-3fd4c226-d8dc-11e7-87e4-ec6d7369cf41.png" width="550">
</p>

## Features

- Hours counting (calendar style).
- Project management (Linking documents, following time left, members, task affectation, ...).
- Fully responsive, progressive app.

## Structure

The repository uses npm & bash for automation.

The folders & files :
- client : Frontend code (Angular 2+).
- database : Script & workbench schema for the database.
- requirements : The requirements of the App (Python pip). Two files : dev and prod.
- tasks : Automated bash tasks.
- config.py : App configuration. Only a dummy example.
- notification_config.py : Configuraton for email notifications.
- main.py : Entry point of the Python API.


## Setup the dev environment

To setup the project, you need [the angular cli](https://cli.angular.io/), Python 2, pip, and virtualenv.

### Server

```bash
virtualenv -p python2 venv
source venv/bin/activate
pip2 install -r requirements/dev.txt
```

### Client 
```bash
cd client
npm install
```

### The database

This application uses MySQL. To develop localy, install docker and [a Mysql image](https://hub.docker.com/_/mysql/).

```bash
# Install docker
sudo apt-get install docker
# Pull the image
sudo docker pull mysql
# Start the local server
sudo docker run --name hours-count -p 3306:3306 -e MYSQL_ROOT_PASSWORD=localroot1234 -d mysql
# Install MySql Client
sudo apt-get install mysql-client
# Connect to DB
mysql -h 127.0.0.1 -u root -p
```

If you change the login and / or the passowrd, don't forget to update it in the config.py file.

### Start

From the root of the project :

Start the CLI dev server.
```bash
cd client
npm run watch
```
In another terminal : 
```bash
source venv/bin/activate
python2 main.py
```

## MySQL database provisionning

The repo contains an ansible script to create the MySQL database starting from a Ubuntu 17.04.

The command to start the script is :
```
ansible-playbook ansible/mysql-setup.yaml -i '<machine-ip>,' --extra-vars "mysql_toolbox_password=<password>"
```

## Build

The repo supplies a build.sh files in the tasks folder to generate a final folder with only the necessary dependencies.

Usage :

```bash
./tasks/build.sh user_api_login user_api_password user_api_secret user_api_host db_api_login db_api_password db_api_host
```

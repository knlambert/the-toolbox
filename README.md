

# Structure

The repository uses npm & bash for automation.

The folders & files :
- client : Frontend code (Angular2).
- database : Script & workbench schema for the database.
- assets : Various resources for the front end.
- requirements : The requirements of the App (Python pip).
- tasks : Automated bash tasks.
- config.py : App configuration. Only a dummy example.
- main.py : Entry point.
- tsconfig : Typescript config.
- webpack.[dev|prod].config.js : Webpack configuration depending what you want to do.

## Automated tasks

We supply in bash a set of commands to make your life easier.

- Setup the project.
```bash
./task/setup.sh
```

## The database

This application use MySQL on Google Cloud Platform. To develop in localy, you need to install docker and [a Mysql image](https://hub.docker.com/_/mysql/).

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

## Dev mode

When the configuration & the database are set, just start the developpement server :

```bash
source venv/bin/activate
python2 main.py
```

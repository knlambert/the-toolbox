

# Structure

Note we have two distinct branch. Please use develop for any of your modifications which are not production ready.

The repository use grunt & npm.

# Setting-up

## Grunt automated tasks

We supply in grunt a set of commands to make the deployement easier. Please update it if you add something that requires to be automated.

- **setup** : Init the virtual environment.
- **build** : Build docker image


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

# Deploy

## On Heroku

Push your current build to a deploy branch.
```bash
git checkout -b deploy
git push origin deploy
```

Log to heroku.
```bash
heroku login
```

Identify App to deploy in Heroku.
```bash
heroku git:remote -a APPNAME
```

And then deploy from deploy to master in Heroku
```bash
git push heroku deploy:master   
```



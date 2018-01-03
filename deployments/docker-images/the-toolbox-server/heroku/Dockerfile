FROM debian:stretch
# Update apt cache and install dependencies

RUN apt-get update
# Install other dependencies
RUN apt-get install -y git python python-pip python-dev default-libmysqlclient-dev gunicorn
RUN pip2 install virtualenv
RUN useradd -ms /bin/bash app
USER app
WORKDIR /home/app


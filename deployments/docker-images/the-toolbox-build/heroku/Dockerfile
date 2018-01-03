FROM debian:stretch
# Update apt cache and install dependencies

RUN apt-get update
RUN apt-get -y install curl sudo gnupg wget
# Install node js (to get NPM)
RUN curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg | sudo apt-key add -
RUN curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
RUN wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sudo sh
# Install other dependencies
RUN apt-get install -y nodejs git python python-dev python-pip default-libmysqlclient-dev ansible docker
# Install pip virtualenv
RUN pip2 install virtualenv
# Fix Ng cli bug with workaround, see https://github.com/nodejs/node-gyp/issues/1236#issuecomment-309447800
RUN useradd -ms /bin/bash node
USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
# Install Angular CLI
# RUN npm install -g @angular/cli
# # Go back in root.
# USER root
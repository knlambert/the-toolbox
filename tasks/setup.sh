#!/bin/bash

CURRENT_PATH=`pwd`
# Create Lib directory if doesn't exist.
if [ -d "${CURRENT_PATH}/venv" ]
then
    logger -s -t [INFO] "remove ${CURRENT_PATH}/venv"
    rm -rf "${CURRENT_PATH}/venv"
fi
logger -s -t [INFO] "create virtual env on ${CURRENT_PATH}/venv"
# Install venv.
virtualenv -q -p python2 ${CURRENT_PATH}/venv || logger -s -t [ERROR] "Failed to create virtualenv."
# Look for dev file.
if [ -f "${CURRENT_PATH}/requirements/dev.txt" ]; then
    dev_file="${CURRENT_PATH}/requirements/dev.txt"
    ${CURRENT_PATH}/venv/bin/pip2 install -q -r ${dev_file} || logger -s -t [ERROR] "failed install ${dev_file}"
fi
# Install NPM packages.
if [ -d "${CURRENT_PATH}/node_modules" ]
then
    logger -s -t [INFO] "remove ${CURRENT_PATH}/node_modules"
    rm -rf "${CURRENT_PATH}/node_modules"
fi
logger -s -t [INFO] "Installing NPM packages..."
npm install || logger -s -t [ERROR] "Failed to install packages."
# Done
logger -s -t [INFO] "Setup script is over."
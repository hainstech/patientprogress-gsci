#!/bin/bash

# pull from the master branch in the right directory
git -C patientprogress pull origin master

# install dependencies and restart pm2
yarn install --cwd patientprogress

pm2 restart patientprogress
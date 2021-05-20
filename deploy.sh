#!/bin/bash

# pull from the master branch in the right directory
git -C patientprogress pull origin master

# install dependencies and restart pm2
yarn install

pm2 restart patientprogress
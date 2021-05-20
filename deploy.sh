#!/bin/bash

# go into the directory
cd patientprogress

# pull from the branch
git pull origin master

# install dependencies and restart pm2
yarn install

pm2 restart patientprogress
#!/bin/bash

#pull from the branch
git pull origin master

# followed by instructions specific to your project that you used to do manually
yarn install

pm2 restart patientprogress
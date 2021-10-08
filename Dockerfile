#Specify a base image
FROM node:16

#Specify a working directory
WORKDIR /usr/app

#Copy the dependencies file
COPY ./packages/server/package.json ./

#Install dependencies
RUN npm install --quiet

#Copy remaining files
COPY ./packages/server ./

#Default command
CMD ["yarn","start"]
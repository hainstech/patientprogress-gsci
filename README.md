# PatientProgress

## _Medical dashboard for research_

[![hainsdominic](https://circleci.com/gh/hainsdominic/patientprogress.svg?style=shield&circle-token=d7f995a631868a35babd4f2aaf5d4aeed40e0194)](https://circleci.com/gh/hainsdominic/patientprogress)

PatientProgress is a mobile-ready front-end application built with React and a RESTful API built with Node.
The PatientProgress web-app is made to facilitate medical research, while being very convenient and time-saving
for the professional and the patient.

## Features

### Patient

- Fill the questionnaires required by your professional
- Visualize your progress with graphs generated with your data
- Easy access to contact information about your professional

### Professional

- Choose which questionnaires you want the patient to fill
- See the filled questionnaires and export them to PDF
- Write reports that are optionally pre-filled with patient data
- Schedule questionnaires for a individual patient
- Visualize the progress of all your patient in a interactive graph

### Researcher

- Access the powerful PatientProgress API to retrieve anonymized patient data
- All the patient's & professional's anonymized data are treatable because of their JSON format.

## Tech

| Codebases | Description   |
| --------- | ------------- |
| server    | Express API   |
| client    | CRA React App |

PatientProgress uses a number of open source projects to work properly:

- [ReactJS](https://reactjs.org) - A JavaScript library for building user interfaces
- [NodeJS](https://nodejs.org) - An asynchronous event-driven JavaScript runtime
- [ExpressJS](https://expressjs.com) - A fast, unopinionated, minimalist web framework for Node.js
- [JWT](https://jwt.io) - An open, industry standard RFC 7519 method for representing claims securely between two parties.

## Installation

PatientProgress requires [Node.js](https://nodejs.org/) V10+ to run.

Go to package/server/config/ and create a new file named config.env

> Replace "production" by "development" depending on your environment

```
NODE_ENV=production
PORT=5000
```

Install the dependencies and devDependencies and start the server.

```sh
yarn install
node package/server/server.js
```

Then build and serve the CRA React application

> The default API call will be dispatched to the official API. This will be an environment variable soon.

```
cd package/client
yarn build
serve -s build
```

## Development

PatientProgress uses Create-React-App, yarn and lerna for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

```sh
yarn dev
```

## Team

Dominic Hains - Maintainer & Developer

import React from 'react';
import { Switch } from 'react-router-dom';

import QuestionnaireList from '../views/patient/QuestionnaireList';
import Questionnaire from '../views/patient/Questionnaire';
import Profile from '../views/patient/Profile';
import MyProfessional from '../views/patient/MyProfessional';

import PatientRoute from './PatientRoute';

const Patient = () => {
  return (
    <Switch>
      <PatientRoute
        exact
        path='/patient/questionnaires'
        component={QuestionnaireList}
      />
      <PatientRoute
        exact
        path='/patient/questionnaires/:id'
        component={Questionnaire}
      />
      <PatientRoute exact path='/patient/profile' component={Profile} />
      <PatientRoute
        exact
        path='/patient/professional'
        component={MyProfessional}
      />
    </Switch>
  );
};

export default Patient;

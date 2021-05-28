import React from 'react';
import { Switch } from 'react-router-dom';

import QuestionnaireBuilder from '../admin/QuestionnaireBuilder';

import AdminRoute from './AdminRoute';

const Admin = () => {
  return (
    <Switch>
      <AdminRoute
        exact
        path='/admin/questionnaire-builder'
        component={QuestionnaireBuilder}
      />
    </Switch>
  );
};

export default Admin;

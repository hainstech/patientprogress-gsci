import React from 'react';
import { Switch } from 'react-router-dom';

import QuestionnaireBuilder from '../views/admin/QuestionnaireBuilder';
import ProfessionalRegister from '../views/admin/ProfessionalRegister';

import AdminRoute from './AdminRoute';

const Admin = () => {
  return (
    <Switch>
      <AdminRoute
        exact
        path="/admin/questionnaire-builder"
        component={QuestionnaireBuilder}
      />
      <AdminRoute
        exact
        path="/admin/professional-register"
        component={ProfessionalRegister}
      />
    </Switch>
  );
};

export default Admin;

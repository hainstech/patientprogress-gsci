import React from 'react';
import { Switch } from 'react-router-dom';

import ProfessionalDashboard from '../professional/ProfessionalDashboard';
import Preferences from '../professional/Preferences';

import ProfessionalRoute from './ProfessionalRoute';

const Professional = () => {
  return (
    <Switch>
      <ProfessionalRoute
        exact
        path='/professional/patients'
        component={ProfessionalDashboard}
      />
      <ProfessionalRoute
        exact
        path='/professional/profile'
        component={ProfessionalDashboard}
      />
      <ProfessionalRoute
        exact
        path='/professional/invite'
        component={ProfessionalDashboard}
      />
      <ProfessionalRoute
        exact
        path='/professional/preferences'
        component={Preferences}
      />
    </Switch>
  );
};

export default Professional;

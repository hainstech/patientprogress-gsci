import React from 'react';
import { Switch } from 'react-router-dom';

import Invite from '../views/professional/Invite';
import Preferences from '../views/professional/Preferences';
import Search from '../views/professional/Search';

import ProfessionalRoute from './ProfessionalRoute';

const Professional = () => {
  return (
    <Switch>
      <ProfessionalRoute
        exact
        path='/professional/patients'
        component={Search}
      />
      <ProfessionalRoute exact path='/professional/invite' component={Invite} />
      <ProfessionalRoute
        exact
        path='/professional/preferences'
        component={Preferences}
      />
    </Switch>
  );
};

export default Professional;

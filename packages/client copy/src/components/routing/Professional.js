import React from 'react';
import { Switch } from 'react-router-dom';

import Invite from '../professional/Invite';
import Preferences from '../professional/Preferences';
import Search from '../professional/Search';

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

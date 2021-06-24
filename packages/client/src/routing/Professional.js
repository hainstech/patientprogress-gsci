import React from 'react';
import { Switch } from 'react-router-dom';

import Invite from '../views/professional/Invite';
import Preferences from '../views/professional/Preferences';
import Search from '../views/professional/Search';
import PatientOverview from '../views/professional/PatientOverview';
import Questionnaire from '../views/professional/Questionnaire';
import NewReport from '../views/professional/NewReport';

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
      <ProfessionalRoute
        exact
        path='/professional/patients/:id'
        component={PatientOverview}
      />
      <ProfessionalRoute
        exact
        path='/professional/patients/:id/questionnaires/:questionnaire_id'
        component={Questionnaire}
      />
      <ProfessionalRoute
        exact
        path='/professional/patients/:id/report'
        component={NewReport}
      />
    </Switch>
  );
};

export default Professional;

import React from 'react';
import { Switch } from 'react-router-dom';

import Invite from '../views/professional/Invite';
import Preferences from '../views/professional/Preferences';
import Search from '../views/professional/Search';
import PatientOverview from '../views/professional/PatientOverview';
import Questionnaire from '../views/professional/Questionnaire';
import NewReport from '../views/professional/NewReport';
import Report from '../views/professional/Report';
import Metrics from '../views/professional/Metrics';
import NewReEvaluationReport from '../views/professional/NewReEvaluationReport';

import ProfessionalRoute from './ProfessionalRoute';

const Professional = () => {
  return (
    <Switch>
      <ProfessionalRoute
        exact
        path='/professional/metrics'
        component={Metrics}
      />
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
      <ProfessionalRoute
        exact
        path='/professional/patients/:id/reports/:report_id'
        component={Report}
      />
      <ProfessionalRoute
        exact
        path='/professional/patients/:id/reevaluationreport'
        component={NewReEvaluationReport}
      />
    </Switch>
  );
};

export default Professional;

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from '@rjsf/material-ui';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardBody from '../../components/Card/CardBody.js';

import { getCurrentProfile } from '../../actions/profile';

import {
  getQuestionnaire,
  addQuestionnaire,
} from '../../actions/questionnaire';
import Spinner from '../../components/Spinner/Spinner';

function Questionnaire({
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
  questionnaire: { questionnaire },
  match,
  history,
}) {
  useEffect(() => {
    getQuestionnaire(match.params.id);
  }, [getQuestionnaire, match.params.id]);

  const onSubmit = async (e) => {
    await addQuestionnaire(
      history,
      match.params.id,
      questionnaire.title,
      formData
    );
    await getCurrentProfile('patient');
  };

  const [formData, setFormData] = useState(null);

  return (
    <Fragment>
      {questionnaire === null ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <Form
                  schema={questionnaire.schema}
                  uiSchema={questionnaire.uischema}
                  formData={formData}
                  onChange={(e) => setFormData(e.formData)}
                  onSubmit={(e) => onSubmit(e)}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </Fragment>
  );
}

Questionnaire.propTypes = {
  getQuestionnaire: PropTypes.func.isRequired,
  questionnaire: PropTypes.object.isRequired,
  addQuestionnaire: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  questionnaire: state.questionnaire,
});

export default connect(mapStateToProps, {
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
})(withRouter(Questionnaire));

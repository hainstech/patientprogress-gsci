import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from 'react-jsonschema-form';

import { getCurrentProfile } from '../../actions/profile';

import {
  getQuestionnaire,
  addQuestionnaire,
} from '../../actions/questionnaire';
import Spinner from '../layout/Spinner';

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
        <div className='row'>
          <div className='col-10 mx-auto'>
            <div className='card card-body'>
              <Form
                schema={questionnaire.schema}
                uiSchema={questionnaire.uischema}
                formData={formData}
                onChange={(e) => setFormData(e.formData)}
                onSubmit={(e) => onSubmit(e)}
              />
            </div>
          </div>
        </div>
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

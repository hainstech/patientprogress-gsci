import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import { connect } from 'react-redux';

import { createQuestionnaire } from '../../actions/questionnaire';

const QuestionnaireBuilder = ({ createQuestionnaire }) => {
  const [state, setState] = useState({
    schema: '',
    uischema: '',
  });

  const handleClick = (e) => {
    e.preventDefault();
    createQuestionnaire(JSON.parse(state.schema), JSON.parse(state.uischema));
  };

  return (
    <Fragment>
      <div className='row mb-5'>
        <div className='col-10 text-center mx-auto'>
          <button className='btn btn-success' onClick={handleClick}>
            CREATE QUESTIONNAIRE
          </button>
        </div>
      </div>
      <div className='row'>
        <div className='col-10 mx-auto'>
          <FormBuilder
            className='questionnaire-builder'
            schema={state.schema}
            uischema={state.uischema}
            onChange={(newSchema, newUiSchema) => {
              setState({
                schema: newSchema,
                uischema: newUiSchema,
              });
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

QuestionnaireBuilder.propTypes = {
  createQuestionnaire: PropTypes.func.isRequired,
};

// Copyright 2020 Ginkgo Bioworks, Inc. Licensed Apache 2.0.

export default connect(null, { createQuestionnaire })(QuestionnaireBuilder);

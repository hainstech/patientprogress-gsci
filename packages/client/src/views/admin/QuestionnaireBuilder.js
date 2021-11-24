import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormBuilder } from '@ginkgo-bioworks/react-json-schema-form-builder';
import { connect } from 'react-redux';

import { createQuestionnaire } from '../../actions/questionnaire';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';

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
    <GridContainer justifyContent="center">
      <GridItem xs={12} md={12}>
        <Alert />
        <Card>
          <Button color="danger" onClick={handleClick}>
            CREATE QUESTIONNAIRE
          </Button>
          <FormBuilder
            className="questionnaire-builder"
            schema={state.schema}
            uischema={state.uischema}
            onChange={(newSchema, newUiSchema) => {
              setState({
                schema: newSchema,
                uischema: newUiSchema,
              });
            }}
          />
        </Card>
      </GridItem>
    </GridContainer>
  );
};

QuestionnaireBuilder.propTypes = {
  createQuestionnaire: PropTypes.func.isRequired,
};

// Copyright 2020 Ginkgo Bioworks, Inc. Licensed Apache 2.0.

export default connect(null, { createQuestionnaire })(QuestionnaireBuilder);

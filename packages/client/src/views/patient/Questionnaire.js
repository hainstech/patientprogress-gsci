import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from '@rjsf/material-ui';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';

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

const nativeSelect = function (props) {
  const handleChange = (event) => {
    const value = event.target.value;
    props.onChange(value);
  };

  return (
    <>
      <InputLabel htmlFor={props.label}>{props.label}</InputLabel>
      <NativeSelect
        value={props.value}
        onChange={handleChange}
        inputProps={{
          name: props.id,
          id: props.label,
        }}
      >
        {!props.default && <option aria-label='None' value='' />}

        {props.options.enumOptions.map(({ label, value }) => (
          <option key={`${label}`} value={label}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </>
  );
};

function Questionnaire({
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
  match,
  history,
}) {
  const [questionnaire, setQuestionnaire] = useState(null);

  useEffect(() => {
    (async () => {
      const questionnaire = await getQuestionnaire(match.params.id);
      setQuestionnaire(questionnaire);
    })();
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

  const widgets = {
    nativeSelect,
  };

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
                  widgets={widgets}
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
  addQuestionnaire: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

export default connect(null, {
  getQuestionnaire,
  addQuestionnaire,
  getCurrentProfile,
})(withRouter(Questionnaire));

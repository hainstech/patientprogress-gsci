import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Form from '@rjsf/material-ui';
import { InputLabel, NativeSelect } from '@material-ui/core';
import ImageMapper from 'react-img-mapper';

import URL from '../../assets/img/bodyMap.jpg';
import areasJSON from '../../assets/bodyMap.json';

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

const BodyMap = (props) => {
  // eslint-disable-next-line
  const [regions, setRegions] = useState([]);

  const handleClick = (id) => {
    const newId = id.toString();
    setRegions((regions) => {
      let newArray;
      if (!regions.includes(newId)) {
        newArray = [...regions, newId];
      } else {
        newArray = regions.filter((region) => region !== newId);
      }
      props.onChange(newArray);
      return newArray;
    });
  };

  return (
    <>
      <strong>{props.schema.description}</strong>
      <ImageMapper
        src={URL}
        map={{
          name: 'body-map',
          areas: areasJSON,
        }}
        responsive
        parentWidth={400}
        stayHighlighted
        stayMultiHighlighted
        toggleHighlighted
        onClick={(area) => handleClick(area.id)}
      />
    </>
  );
};

const NativeSelectWidget = function (props) {
  const handleChange = (event) => {
    const value = event.target.value;
    props.onChange(value);
  };

  return (
    <>
      <InputLabel shrink htmlFor={props.label}>
        {props.label}
      </InputLabel>
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
          <option key={`${label}`} value={value}>
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
    nativeSelect: NativeSelectWidget,
  };

  const fields = {
    bodyMap: BodyMap,
  };

  return (
    <Fragment>
      {questionnaire === null ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent='center'>
          <GridItem xs={12}>
            <Card>
              <CardBody>
                <Form
                  widgets={widgets}
                  fields={fields}
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

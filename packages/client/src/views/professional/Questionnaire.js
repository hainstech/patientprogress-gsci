import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { withRouter } from 'react-router-dom';
import flatten from 'flat';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import CardFooter from '../../components/Card/CardFooter.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { getPatient } from '../../actions/professional';

const useStyles = makeStyles(styles);

const Questionnaire = ({
  professional: { patient, loading },
  match,
  getPatient,
  history,
}) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [questionnaire, setQuestionnaire] = useState({});

  const [useId, setUseId] = useState(true);

  const getQuestionnaire = useCallback(
    (newPatient) => {
      if (newPatient) {
        const q = newPatient.questionnaires.filter(
          ({ _id }) => _id === match.params.questionnaire_id
        );

        if (q.length === 1) {
          setQuestionnaire(q[0]);
        }
      }
    },
    [match.params.questionnaire_id]
  );

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      if (!patient) await getPatient(match.params.id);
      getQuestionnaire(patient);
    };
    fetchQuestionnaire();
  }, [
    getPatient,
    match.params.id,
    match.params.questionnaire_id,
    getQuestionnaire,
    patient,
  ]);

  const toggleUseId = (e) => {
    setUseId(e.target.checked);
  };

  return (
    <>
      {patient === null ||
      !questionnaire ||
      !questionnaire.questionnaire ||
      loading ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {`${questionnaire && questionnaire.title} (${
                    questionnaire && questionnaire.questionnaire.language
                  }) - ${patient.name} - ${dayjs(questionnaire.time).format(
                    'YYYY/MM/DD'
                  )}`}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {questionnaire.questionnaire.schema.description}
                </p>
              </CardHeader>
              <CardBody>
                <FormControlLabel
                  control={
                    <Switch
                      checked={useId}
                      onChange={toggleUseId}
                      name='useId'
                      color='primary'
                    />
                  }
                  label={t('professional.patient.useID')}
                />
                {Object.entries(flatten(questionnaire.answers)).map(
                  ([key, value]) => {
                    key = key.replace(/^"|"$/g, '');
                    value = value.replace(/^"|"$/g, '');
                    return useId ? (
                      <p key={key}>
                        <strong>{key}:</strong> {value}
                      </p>
                    ) : (
                      <p key={key}>
                        <strong>
                          {
                            questionnaire.questionnaire.schema.properties[key]
                              .title
                          }
                          :
                        </strong>{' '}
                        {value}
                      </p>
                    );
                  }
                )}
              </CardBody>
              <CardFooter>
                <Button onClick={() => history.goBack()} color='danger'>
                  {t('professional.patient.back')}
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
};

Questionnaire.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
})(withRouter(Questionnaire));

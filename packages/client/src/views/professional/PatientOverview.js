import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { useFormik } from 'formik';

import { TextField, FormControl } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';

import {
  getPatient,
  getQuestionnaireList,
  sendQuestionnaire,
  removeQuestionnaire,
} from '../../actions/professional';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
const useStyles = makeStyles(styles);

const PatientOverview = ({
  professional: { patient, loading },
  match,
  getPatient,
  getQuestionnaireList,
  sendQuestionnaire,
  removeQuestionnaire,
}) => {
  const classes = useStyles();

  const [displayList, setDisplayList] = useState([]);
  const [questionnaireList, setQuestionnaireList] = useState([]);

  const parseDisplayList = useCallback(({ data: list }) => {
    setQuestionnaireList(list);
    const newList = [];
    list.forEach((questionnaire) => {
      //si il est pas la on l'ajoute
      if (!newList.find((q) => q.title === questionnaire.title)) {
        newList.push({ title: questionnaire.title });
      }
    });
    setDisplayList(newList);
  }, []);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      await getPatient(match.params.id);
      parseDisplayList(await getQuestionnaireList());
    };
    fetchQuestionnaire();
  }, [getPatient, getQuestionnaireList, match.params.id, parseDisplayList]);

  const formik = useFormik({
    initialValues: {
      questionnaire: null,
    },
    onSubmit: (data) => {
      // sendQuestionnaire(questionnaire.id)
      // @v trouver le ID a envoyer
      // on regarde si il existe dans la langue du patient
      // si oui on l'envoie sinon on l'envoie en anglais
      if (data.questionnaire) {
        let id;
        const { title } = data.questionnaire;
        const foundQ = questionnaireList.find(
          (q) => q.title === title && q.language === patient.language
        );
        if (foundQ) {
          id = foundQ.id;
        } else {
          id = questionnaireList.find(
            (q) => q.title === title && q.language === 'en'
          ).id;
        }

        sendQuestionnaire(patient._id, id);
      }
    },
  });

  const { t } = useTranslation();

  const renderViewButton = (params) => {
    return (
      <Link
        to={`/professional/patients/${match.params.id}/questionnaires/${params.row.id}`}
      >
        <Button color='success'>{t('professional.patient.view')}</Button>
      </Link>
    );
  };

  const renderDeleteButton = (params) => {
    return (
      <Button
        color='danger'
        justIcon
        onClick={() => {
          removeQuestionnaire(match.params.id, params.row.questionnaire);
        }}
      >
        <DeleteIcon />
      </Button>
    );
  };

  return (
    <>
      {patient === null || questionnaireList.length === 0 || loading ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <Alert />
          <GridItem xs={12} lg={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.patient.detailsTitle')}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify='center'>
                  <GridItem xs={12} xl={4}>
                    {t('professional.patient.name')}: {patient.name}
                  </GridItem>

                  <GridItem xs={12} xl={4}>
                    {t('professional.patient.dob')}:{' '}
                    {format(
                      zonedTimeToUtc(
                        parseISO(patient.dob),
                        Intl.DateTimeFormat().resolvedOptions().timeZone
                      ),
                      'yyyy/MM/dd'
                    )}
                  </GridItem>

                  <GridItem xs={12} xl={4}>
                    {t('professional.patient.gender')}:{' '}
                    {patient.gender === 'Male' || patient.gender === 'Female'
                      ? t(`professional.patient.${patient.gender}`)
                      : patient.gender}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.patient.sendQuestionnaire')}
                </h4>
              </CardHeader>
              <CardBody>
                <form onSubmit={formik.handleSubmit}>
                  <GridContainer>
                    <GridItem xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Autocomplete
                          id='questionnaireToSend'
                          name='questionnaire'
                          options={displayList}
                          getOptionLabel={(option) => option.title}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={t('professional.patient.questionnaire')}
                            />
                          )}
                          value={formik.values.questionnaire}
                          onChange={(e, value) =>
                            formik.setFieldValue('questionnaire', value)
                          }
                        />
                      </FormControl>
                    </GridItem>

                    <GridItem xs={12} sm={6}>
                      <Button type='submit' color='success'>
                        {t('professional.invite.submit')}
                      </Button>
                    </GridItem>
                  </GridContainer>
                </form>
              </CardBody>
            </Card>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.patient.pendingQuestionnaires')}
                </h4>
              </CardHeader>
              <CardBody>
                {patient.questionnairesToFill.length > 0 ? (
                  <div style={{ height: 250, width: '100%' }}>
                    <DataGrid
                      disableSelectionOnClick
                      rows={patient.questionnairesToFill.map(
                        ({ questionnaire, date }, i) => {
                          const title = questionnaireList.find(
                            (q) => q.id === questionnaire
                          ).title;
                          return {
                            id: `${i}-${questionnaire}`,
                            questionnaire,
                            title,
                            time: format(
                              zonedTimeToUtc(
                                parseISO(date),
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                              ),
                              'yyyy/MM/dd'
                            ),
                          };
                        }
                      )}
                      columns={[
                        {
                          field: 'title',
                          headerName: `${t(
                            'professional.patient.questionnaire'
                          )}`,
                          width: 200,
                        },
                        {
                          field: 'time',
                          headerName: `${t('professional.patient.dateSent')}`,
                          width: 160,
                        },
                        {
                          field: 'id',
                          headerName: `${t('professional.patient.remove')}`,
                          sortable: false,
                          width: 110,
                          disableClickEventBubbling: true,
                          renderCell: renderDeleteButton,
                        },
                      ]}
                      pageSize={2}
                    />
                  </div>
                ) : (
                  <p style={{ textAlign: 'center' }}>
                    {t('professional.patient.none')}
                  </p>
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} lg={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.patient.filledQuestionnaires')}
                </h4>
              </CardHeader>
              <CardBody>
                {patient.questionnaires.length > 0 ? (
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      disableSelectionOnClick
                      rows={patient.questionnaires
                        .map(({ title, time, _id }) => {
                          return {
                            id: _id,
                            title,
                            time: format(
                              zonedTimeToUtc(
                                parseISO(time),
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                              ),
                              'yyyy/MM/dd'
                            ),
                          };
                        })
                        .reverse()}
                      columns={[
                        {
                          field: 'id',
                          headerName: `${t('professional.patient.answers')}`,
                          sortable: false,
                          width: 115,
                          disableClickEventBubbling: true,
                          renderCell: renderViewButton,
                        },
                        {
                          field: 'title',
                          headerName: `${t(
                            'professional.patient.questionnaire'
                          )}`,
                          width: 200,
                        },
                        {
                          field: 'time',
                          headerName: `${t('professional.patient.date')}`,
                          width: 110,
                        },
                      ]}
                      pageSize={5}
                    />
                  </div>
                ) : (
                  <p style={{ textAlign: 'center' }}>
                    {t('professional.patient.none')}
                  </p>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
};

PatientOverview.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
  getQuestionnaireList: PropTypes.func.isRequired,
  sendQuestionnaire: PropTypes.func.isRequired,
  removeQuestionnaire: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
  getQuestionnaireList,
  sendQuestionnaire,
  removeQuestionnaire,
})(PatientOverview);

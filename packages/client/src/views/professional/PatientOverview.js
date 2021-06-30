import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import DatePicker from 'react-multi-date-picker';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

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
  sendQuestionnaires,
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
  sendQuestionnaires,
  removeQuestionnaire,
}) => {
  const classes = useStyles();

  const [displayList, setDisplayList] = useState([]);
  const [questionnaireList, setQuestionnaireList] = useState([]);
  const [scheduled, setScheduled] = useState(false);
  const [dates, setDates] = useState([]);
  const [questionnaires, setQuestionnaires] = useState([]);

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
      if (!patient || patient._id !== match.params.id)
        await getPatient(match.params.id);
      parseDisplayList(await getQuestionnaireList());
    };
    fetchQuestionnaire();
  }, [
    getPatient,
    patient,
    getQuestionnaireList,
    match.params.id,
    parseDisplayList,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // For each questionnaire
    // si il y a des dates => envoie aux dates
    // sinon envoie maintenant

    const toFill = [];

    questionnaires.forEach((questionnaire) => {
      // @v trouver le ID a envoyer
      // on regarde si il existe dans la langue du patient
      // si oui on l'envoie sinon on l'envoie en anglais

      let id;
      const { title } = questionnaire;
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

      if (dates.length === 0) {
        toFill.push({
          questionnaire: id,
          date: Date.now(),
          sent: true,
        });
      } else {
        dates.forEach((date) => {
          toFill.push({
            questionnaire: id,
            date: date.toString(),
            sent: false,
          });
        });
      }
    });
    if (toFill.length > 0) {
      sendQuestionnaires(patient._id, toFill);
    }
  };

  const { t } = useTranslation();

  const renderQuestionnaireViewButton = (params) => {
    return (
      <Link
        to={`/professional/patients/${match.params.id}/questionnaires/${params.row.id}`}
      >
        <Button color='success'>{t('professional.patient.view')}</Button>
      </Link>
    );
  };

  const renderReportViewButton = (params) => {
    return (
      <Link
        to={`/professional/patients/${match.params.id}/reports/${params.row.id}`}
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

  const renderSent = (params) => {
    return params.row.sent ? <CheckIcon /> : <ClearIcon />;
  };

  const toggleScheduled = (e) => {
    setScheduled(e.target.checked);
  };

  function handleDateChange(dates) {
    console.log(dates);
    setDates(dates);
  }

  return (
    <>
      {patient === null || questionnaireList.length === 0 || loading ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <Alert />
          <GridItem xs={12} xl={6}>
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
                  {t('professional.patient.reports')}
                </h4>
              </CardHeader>
              <CardBody>
                {patient.questionnaires.filter(
                  ({ title }) => title === 'Initial Intake Form'
                ).length > 0 ? (
                  <Link to={`/professional/patients/${match.params.id}/report`}>
                    <Button color='success' style={{ marginBottom: 15 }}>
                      {t('professional.patient.newReport')}
                    </Button>
                  </Link>
                ) : (
                  'No initial intake filled yet'
                )}

                {patient.reports.length > 0 && (
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      disableSelectionOnClick
                      rows={patient.reports
                        .map(({ date, _id }) => {
                          return {
                            id: _id,
                            time: format(
                              zonedTimeToUtc(
                                parseISO(date),
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
                          headerName: t('professional.patient.view'),
                          sortable: false,
                          width: 115,
                          disableClickEventBubbling: true,
                          renderCell: renderReportViewButton,
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
                )}
              </CardBody>
            </Card>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.patient.sendQuestionnaire')}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={9}>
                    <FormControl fullWidth>
                      <Autocomplete
                        multiple
                        id='questionnaireToSend'
                        name='questionnaire'
                        options={displayList}
                        getOptionLabel={(option) => option.title}
                        getOptionSelected={(option) => {
                          let found = false;
                          displayList.forEach(
                            (item) => (found = item.title === option.title)
                          );
                          return found;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={t('professional.patient.questionnaire')}
                          />
                        )}
                        onChange={(e, value) => setQuestionnaires(value)}
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem xs={12} sm={3}>
                    <Button color='success' onClick={handleSubmit}>
                      {t('professional.invite.submit')}
                    </Button>
                  </GridItem>

                  <GridItem xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={scheduled}
                          onChange={toggleScheduled}
                          name='scheduled'
                          color='primary'
                        />
                      }
                      label={t('professional.patient.scheduled')}
                    />
                  </GridItem>
                </GridContainer>
                {scheduled && (
                  <GridContainer wrap='nowrap'>
                    <GridItem>
                      <p>{t('professional.patient.selectDates')}:</p>
                    </GridItem>
                    <GridItem xs={5}>
                      <DatePicker
                        style={{ margin: '14px 0px' }}
                        value={dates}
                        onChange={handleDateChange}
                        multiple
                        plugins={[<DatePanel />]}
                      />
                    </GridItem>
                  </GridContainer>
                )}
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} xl={6}>
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
                        ({ questionnaire, date, sent }, i) => {
                          const title = questionnaireList.find(
                            (q) => q.id === questionnaire
                          ).title;
                          return {
                            id: `${i}-${questionnaire}`,
                            questionnaire,
                            sent,
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
                          field: 'sent',
                          headerName: `${t('professional.patient.sent')}`,
                          sortable: false,
                          width: 81,
                          disableClickEventBubbling: true,
                          renderCell: renderSent,
                        },
                        {
                          field: 'time',
                          headerName: `${t('professional.patient.date')}`,
                          width: 105,
                        },
                        {
                          field: 'id',
                          headerName: `${t('professional.patient.remove')}`,
                          sortable: false,
                          width: 105,
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
                          renderCell: renderQuestionnaireViewButton,
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
  sendQuestionnaires: PropTypes.func.isRequired,
  removeQuestionnaire: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
  getQuestionnaireList,
  sendQuestionnaires,
  removeQuestionnaire,
})(PatientOverview);

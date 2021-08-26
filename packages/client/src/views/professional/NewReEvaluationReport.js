import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  FormControl,
  Typography,
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  Slider,
  RadioGroup,
} from '@material-ui/core';

import { useFormik } from 'formik';

import areasJSON from '../../assets/bodyMap.json';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';

import { getPatient, sendReEvaluationReport } from '../../actions/professional';
import { getCurrentProfile } from '../../actions/profile';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useInputStyles = makeStyles(inputStyles);
const useStyles = makeStyles(styles);

const getAge = (birthDate) => {
  return Math.floor((new Date() - new Date(birthDate).getTime()) / 3.15576e10);
};

const getLastQuestionnaire = (questionnaires, questionnaireTitle) => {
  const foundQuestionnaires = questionnaires.filter(
    ({ title }) => title === questionnaireTitle
  );
  return foundQuestionnaires.length > 0
    ? foundQuestionnaires[foundQuestionnaires.length - 1]
    : null;
};

const getLastInitialReport = (reports) => {
  return reports[reports.length - 1];
};

const getLastReport = (initialReports, reEvaluationReports) => {
  const lastInitialReport = initialReports[initialReports.length - 1];
  const lastReEvaluationReport =
    reEvaluationReports[reEvaluationReports.length - 1];

  if (!lastReEvaluationReport) return lastInitialReport;

  const lastInitialReportDate = new Date(lastInitialReport.date);
  const lastReEvaluationReportDate = new Date(lastReEvaluationReport.date);
  return lastInitialReportDate > lastReEvaluationReportDate
    ? lastInitialReport
    : lastReEvaluationReport;
};

const fractionStrToDecimal = (str) => str.split('/').reduce((p, c) => p / c);

const parseImprovement = (oldScore, newScore) => {
  oldScore = fractionStrToDecimal(oldScore);
  newScore = fractionStrToDecimal(newScore);

  return ((newScore - oldScore) / oldScore) * 100;
};

const parseImprovements = (relevantScore, questionnaires) => {
  // For every questionnaire
  // Get the most recent one
  // For every score
  // Check if the value string contains a letter
  // If it doesn't, convert to decimal and calculate improvement
  // Return the whole score object

  return relevantScore.map((questionnaireScore) => {
    let questionnaire = getLastQuestionnaire(
      questionnaires,
      questionnaireScore.name
    );

    return {
      name: questionnaire.title,
      date: questionnaire.time,
      score: questionnaireScore.score.map((score) => {
        if (!/^[a-zA-Z]+$/.test(score.value)) {
          let newScore = questionnaire.score.find(
            (e) => e.title === score.title
          );
          return {
            ...newScore,
            improvement: parseImprovement(score.value, newScore.value),
          };
        }
        return score;
      }),
    };
  });
};

const NewReEvaluationReport = ({
  professional: { patient, loading },
  profile: { profile, loading: ploading },
  getCurrentProfile,
  match,
  getPatient,
  sendReEvaluationReport,
  history,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const [
    displaySpinalDiagnosticClassification,
    setDisplaySpinalDiagnosticClassification,
  ] = useState(false);

  const [displayReferences, setDisplayReferences] = useState(false);
  const [referenceList, setReferenceList] = useState([]);

  const [intake, setIntake] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [planOfManagement, setPlanOfManagement] = useState([]);

  const [oldReportInput, setOldReportInput] = useState({
    diagnosis: '',
    additionalDiagnosis: '',
    differentialDiagnosis: '',
    frequency: '',
    planOfManagementOther: '',
  });

  useEffect(() => {
    // Callback hell... sorry
    getCurrentProfile('professional').then((professional) =>
      getPatient(match.params.id).then((patient) => {
        const lastReport = getLastReport(
          patient.reports,
          patient.reEvaluationReports
        );

        setOldReportInput({
          diagnosis: lastReport.diagnosis,
          additionalDiagnosis: lastReport.additionalDiagnosis,
          differentialDiagnosis: lastReport.differentialDiagnosis,
          frequency: lastReport.frequency,
          planOfManagementOther: lastReport.planOfManagementOther?.join(', '),
        });

        setObjectives(lastReport.objectives);
        setPlanOfManagement(lastReport.planOfManagement);

        const lastIntake = getLastQuestionnaire(
          patient.questionnaires,
          'Initial Intake Form'
        );

        const lastInitialReport = getLastInitialReport(patient.reports);

        const lastFollowUp = getLastQuestionnaire(
          patient.questionnaires,
          'Follow-up questionnaire'
        );

        // Data processed to be displayed and save. Not necessarily from the intake questionnaire.
        setIntake({
          dob: patient.dob,
          age: getAge(patient.dob),
          intakeUsed: lastIntake._id,
          date: new Date(),
          initialReportDate: new Date(lastInitialReport.date),
          professionalName: professional.name,
          professionalProfession: professional.profession,
          // Chief complaint
          chiefComplaint: lastIntake.answers.chiefComplaint,
          chiefComplaintStart: lastIntake.answers.chiefComplaintStart,
          otherComplaints: lastIntake.answers.otherComplaints || '',
          // Body maps
          allPainAreas: lastFollowUp.answers.allPainAreas,
          relatedPainAreas: lastFollowUp.answers.relatedPainAreas,
          comorbidities: lastInitialReport.comorbidities,
          redFlags: lastInitialReport.redFlags,
          // Facultative scores
          relevantScore: parseImprovements(
            lastInitialReport.relevantScore,
            patient.questionnaires
          ),
          // Follow-up
          improvementPain: lastFollowUp.answers.pain,
          improvementFunction: lastFollowUp.answers.function,
          improvementQualityOfLife: lastFollowUp.answers.qualityOfLife,
          treatmentsSatisfaction: lastFollowUp.answers.treatmentsSatisfaction,
          chiropractorSatisfaction:
            lastFollowUp.answers.chiropractorSatisfaction,

          initialGlobalExpectationOfClinicalChange:
            lastInitialReport.globalExpectationOfClinicalChange,
          chiefComplaintInitialDiagnosis: lastInitialReport.diagnosis,
          secondaryComplaintInitialDiagnosis:
            lastInitialReport.additionalDiagnosis,
        });
      })
    );
  }, [getPatient, match.params.id, getCurrentProfile]);

  const handleReferenceListChange = (event) => {
    if (referenceList.indexOf(event.target.name) > -1) {
      setReferenceList(referenceList.filter((id) => id !== event.target.name));
      return;
    }
    setReferenceList([...referenceList, event.target.name]);
  };

  const handleReference = (value) => {
    if (value === 'No' || value === 'Non') {
      setDisplayReferences(false);
    } else {
      setDisplayReferences(true);
    }
  };

  const handleObjectivesChange = (event) => {
    if (objectives.indexOf(event.target.name) > -1) {
      setObjectives(objectives.filter((id) => id !== event.target.name));
      return;
    }
    setObjectives([...objectives, event.target.name]);
  };

  const handlePlanOfManagementChange = (event) => {
    if (planOfManagement.indexOf(event.target.name) > -1) {
      setPlanOfManagement(
        planOfManagement.filter((id) => id !== event.target.name)
      );
      return;
    }
    setPlanOfManagement([...planOfManagement, event.target.name]);
  };

  const formik = useFormik({
    initialValues: {
      investigationResults: '',
      additionalInvestigation: null,
      additionalInvestigationSpecify: '',
      neckOrLowerBackCondition: null,
      spinalDiagnosticClassification: null,
      diagnosis: oldReportInput.diagnosis,
      additionalDiagnosis: oldReportInput.additionalDiagnosis,
      differentialDiagnosis: oldReportInput.differentialDiagnosis,
      numberOfTreatmentsProvided: '',
      numberOfAdditionalTreatments: '',
      frequency: oldReportInput.frequency,
      frequencySpecify: '',
      planOfManagementOther: oldReportInput.planOfManagementOther,
      currentEmploymentStatus: '',
      continueActivities: null,
      continueActivitiesSpecify: '',
      functionalLimitation: null,
      functionalLimitationSpecify: '',
      reference: null,
      referenceListOther: '',
      referenceListReason: '',
      globalImpressionOfClinicalChange: 0,
      globalExpectationOfClinicalChange: 0,
      maximalMedicalImprovement: '',
      maximalMedicalImprovementSpecify: '',
      globalExpectationOfClinicalChangeSpecify: '',
    },
    enableReinitialize: true,
    onSubmit: async (data) => {
      await sendReEvaluationReport(match.params.id, {
        ...data,
        ...intake,
        objectives,
        planOfManagement,
      });
      history.goBack();
    },
  });

  const { t } = useTranslation();

  const handleNeckOrLowerBackCondition = (value) => {
    if (value === 'Yes' || value === 'Oui') {
      setDisplaySpinalDiagnosticClassification(true);
    } else {
      setDisplaySpinalDiagnosticClassification(false);
    }
  };

  return (
    <>
      {!intake.date ||
      patient === null ||
      loading ||
      profile === null ||
      ploading ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent='center'>
          <Alert />
          <GridItem xs={12}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('report.newReEvaluationReport')}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.patientData')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12}>
                            {t('report.name')}: {patient.name}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('professional.patient.gender')}:{' '}
                            {patient.gender === 'Male' ||
                            patient.gender === 'Female'
                              ? t(`professional.patient.${patient.gender}`)
                              : patient.gender}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.dob')}:{' '}
                            {format(
                              zonedTimeToUtc(
                                parseISO(intake.dob),
                                Intl.DateTimeFormat().resolvedOptions().timeZone
                              ),
                              'yyyy/MM/dd'
                            )}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.age')}: {intake.age}
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.about')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12}>
                            {t('report.date')}:{' '}
                            {format(intake.date, 'yyyy/MM/dd')}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.initialReportDate')}:{' '}
                            {format(intake.initialReportDate, 'yyyy/MM/dd')}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.professional')}:{' '}
                            {intake.professionalName}
                          </GridItem>
                          <GridItem xs={12}>
                            {/* #TODO Translate the profession */}
                            {t('report.profession')}:{' '}
                            {intake.professionalProfession}
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.complaint')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12}>
                            {t('report.chiefComplaint')}:{' '}
                            {intake.chiefComplaint}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.onsetDate')}:{' '}
                            {intake.chiefComplaintStart}
                          </GridItem>
                          <GridItem xs={12}>
                            {t(
                              'report.initialGlobalExpectationOfClinicalChange'
                            )}
                            : {intake.initialGlobalExpectationOfClinicalChange}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.chiefComplaintInitialDiagnosis')}:{' '}
                            {intake.chiefComplaintInitialDiagnosis}
                          </GridItem>

                          {intake.otherComplaints && (
                            <GridItem xs={12}>
                              {t('report.secondaryComplaints')}:{' '}
                              {intake.otherComplaints}
                            </GridItem>
                          )}
                          {intake.secondaryComplaintInitialDiagnosis && (
                            <GridItem xs={12}>
                              {t('report.secondaryComplaintInitialDiagnosis')}:{' '}
                              {intake.secondaryComplaintInitialDiagnosis}
                            </GridItem>
                          )}
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.relatedPainAreas')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        {/* <ImageMapper
                          src={URL}
                          map={{
                            name: t('report.relatedPainAreas'),
                            areas: areasJSON,
                          }}
                          responsive
                          parentWidth={400}
                          stayHighlighted
                          stayMultiHighlighted
                          toggleHighlighted
                          onLoad={handleLoaded}
                          disabled={disabled}
                        /> */}
                        {areasJSON
                          .filter(({ id }) =>
                            intake.relatedPainAreas.includes(id)
                          )
                          .map(({ title }) => (
                            <p key={title}>{title}</p>
                          ))}
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.allPainAreas')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        {/* <ImageMapper
                          src={URL}
                          map={{
                            name: t('report.allPainAreas'),
                            areas: areasJSON,
                          }}
                          responsive
                          parentWidth={400}
                          stayHighlighted
                          stayMultiHighlighted
                          toggleHighlighted
                          onLoad={handleLoaded}
                          disabled={disabled}
                        /> */}
                        {areasJSON
                          .filter(({ id }) => intake.allPainAreas.includes(id))
                          .map(({ title }) => (
                            <p key={title}>{title}</p>
                          ))}
                      </CardBody>
                    </Card>
                  </GridItem>

                  {intake.comorbidities.length > 0 && (
                    <GridItem xs={12}>
                      <Card>
                        <CardHeader color='danger'>
                          <p className={classes.cardTitleWhite}>
                            {t('report.comorbidities')}
                          </p>
                        </CardHeader>
                        <CardBody>
                          {intake.comorbidities.map((comorbidity, i) => (
                            <GridContainer key={`${i}-${comorbidity.name}1`}>
                              <GridItem
                                key={`${i}-${comorbidity.name}`}
                                xs={12}
                              >
                                {t('report.comorbidity')}:{' '}
                                {t(`report.${comorbidity.name}`)}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.treatment}`}
                                xs={12}
                              >
                                {t('report.isReveivingTreatment')}:{' '}
                                {comorbidity.treatment}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.activityLimitation}`}
                                xs={12}
                              >
                                {t('report.activityLimitation')}:{' '}
                                {comorbidity.activityLimitation}
                              </GridItem>
                            </GridContainer>
                          ))}
                        </CardBody>
                      </Card>
                    </GridItem>
                  )}

                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.redFlags')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        {intake.redFlags.toString()
                          ? intake.redFlags.join(', ')
                          : t('report.none')}
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.relevantScores')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        {intake.relevantScore.length === 0 && t('report.none')}
                        {intake.relevantScore &&
                          intake.relevantScore.map((score, i) => (
                            <GridContainer
                              key={i}
                              style={{ paddingBottom: 20 }}
                            >
                              <GridItem key={`${i}-${score.name}`} xs={12}>
                                {score.name} (
                                {format(
                                  zonedTimeToUtc(
                                    parseISO(score.date),
                                    Intl.DateTimeFormat().resolvedOptions()
                                      .timeZone
                                  ),
                                  'yyyy/MM/dd'
                                )}
                                ):
                              </GridItem>
                              {score.score.map(
                                ({ title, value, improvement }, y) => (
                                  <React.Fragment key={y + i}>
                                    <GridItem xs={12}>
                                      {t(`professional.patient.score.${title}`)}
                                      :{' '}
                                      {/\d/.test(value)
                                        ? value
                                        : t(
                                            `professional.patient.score.${value}`
                                          )}
                                    </GridItem>
                                    {improvement ? (
                                      <GridItem xs={12}>
                                        {t('report.improvement')}:{' '}
                                        {Math.round(improvement)}%
                                      </GridItem>
                                    ) : null}
                                  </React.Fragment>
                                )
                              )}
                            </GridContainer>
                          ))}
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.improvement')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12}>
                            {t('report.improvementPain')}:{' '}
                            {intake.improvementPain}
                            /10
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.improvementFunction')}:{' '}
                            {intake.improvementFunction}/10
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.improvementQualityOfLife')}:{' '}
                            {intake.improvementQualityOfLife}/10
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <Card>
                      <CardHeader color='danger'>
                        <p className={classes.cardTitleWhite}>
                          {t('report.satisfaction')}
                        </p>
                      </CardHeader>
                      <CardBody>
                        <GridContainer>
                          <GridItem xs={12}>
                            {t('report.treatmentsSatisfaction')}:{' '}
                            {intake.treatmentsSatisfaction}/10
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.chiropractorSatisfaction')}:{' '}
                            {intake.chiropractorSatisfaction}/10
                          </GridItem>
                        </GridContainer>
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                      <GridContainer>
                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color='danger'>
                              <p className={classes.cardTitleWhite}>
                                {t('report.findings')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.investigationResults')}
                                      type='text'
                                      id={'investigationResults'}
                                      value={formik.values.investigationResults}
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                              <GridContainer>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.additionalInvestigation')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='additionalInvestigation'
                                      name='additionalInvestigation'
                                      value={
                                        formik.values.additionalInvestigation
                                      }
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value={t('report.no')}
                                        control={<Radio required />}
                                        label={t('report.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.yes')}
                                        control={<Radio />}
                                        label={t('report.yes')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={'additionalInvestigationSpecify'}
                                      value={
                                        formik.values
                                          .additionalInvestigationSpecify
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                          </Card>
                        </GridItem>
                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color='danger'>
                              <p className={classes.cardTitleWhite}>
                                {t('report.diagnosisTitle')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.neckOrLowerBackCondition')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='neckOrLowerBackCondition'
                                      name='neckOrLowerBackCondition'
                                      value={
                                        formik.values.neckOrLowerBackCondition
                                      }
                                      onChange={(e) => {
                                        handleNeckOrLowerBackCondition(
                                          e.target.value
                                        );
                                        formik.handleChange(e);
                                      }}
                                    >
                                      <FormControlLabel
                                        value={t('report.no')}
                                        control={<Radio required />}
                                        label={t('report.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.yes')}
                                        control={<Radio />}
                                        label={t('report.yes')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                {displaySpinalDiagnosticClassification && (
                                  <GridItem xs={12}>
                                    <FormControl
                                      fullWidth
                                      className={inputClasses.formControl}
                                      component='fieldset'
                                    >
                                      <FormLabel component='legend'>
                                        {t(
                                          'report.spinalDiagnosticClassification.title'
                                        )}
                                      </FormLabel>

                                      <RadioGroup
                                        aria-label='spinalDiagnosticClassification'
                                        name='spinalDiagnosticClassification'
                                        value={
                                          formik.values
                                            .spinalDiagnosticClassification
                                        }
                                        onChange={formik.handleChange}
                                      >
                                        <FormControlLabel
                                          value={t(
                                            'report.spinalDiagnosticClassification.grade1-2'
                                          )}
                                          control={<Radio />}
                                          label={t(
                                            'report.spinalDiagnosticClassification.grade1-2'
                                          )}
                                        />
                                        <FormControlLabel
                                          value={t(
                                            'report.spinalDiagnosticClassification.grade3'
                                          )}
                                          control={<Radio />}
                                          label={t(
                                            'report.spinalDiagnosticClassification.grade3'
                                          )}
                                        />
                                        <FormControlLabel
                                          value={t(
                                            'report.spinalDiagnosticClassification.lowBackPainNonSpecific'
                                          )}
                                          control={<Radio />}
                                          label={t(
                                            'report.spinalDiagnosticClassification.lowBackPainNonSpecific'
                                          )}
                                        />
                                        <FormControlLabel
                                          value={t(
                                            'report.spinalDiagnosticClassification.sciatica'
                                          )}
                                          control={<Radio />}
                                          label={t(
                                            'report.spinalDiagnosticClassification.sciatica'
                                          )}
                                        />
                                      </RadioGroup>
                                    </FormControl>
                                  </GridItem>
                                )}
                              </GridContainer>
                              <GridContainer>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      required
                                      label={t('report.diagnosis')}
                                      type='text'
                                      id={'diagnosis'}
                                      value={formik.values.diagnosis}
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>

                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.additionalDiagnosis')}
                                      type='text'
                                      id={'additionalDiagnosis'}
                                      value={formik.values.additionalDiagnosis}
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>

                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.differentialDiagnosis')}
                                      type='text'
                                      id={'differentialDiagnosis'}
                                      value={
                                        formik.values.differentialDiagnosis
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                          </Card>
                        </GridItem>
                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color='danger'>
                              <p className={classes.cardTitleWhite}>
                                {t('report.evolution')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <Typography
                                      id='discrete-slider'
                                      gutterBottom
                                    >
                                      {t('report.gicc')}
                                    </Typography>
                                    <Slider
                                      onChange={(element, value) =>
                                        formik.setFieldValue(
                                          'globalImpressionOfClinicalChange',
                                          value
                                        )
                                      }
                                      defaultValue={0}
                                      value={
                                        formik.values
                                          .globalImpressionOfClinicalChange
                                      }
                                      aria-labelledby='discrete-slider'
                                      valueLabelDisplay='auto'
                                      step={1}
                                      min={0}
                                      max={10}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.maximalMedicalImprovement')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='maximalMedicalImprovement'
                                      name='maximalMedicalImprovement'
                                      value={
                                        formik.values.maximalMedicalImprovement
                                      }
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value={t('report.no')}
                                        control={<Radio required />}
                                        label={t('report.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.yes')}
                                        control={<Radio />}
                                        label={t('report.yes')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={'maximalMedicalImprovementSpecify'}
                                      value={
                                        formik.values
                                          .maximalMedicalImprovementSpecify
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                          </Card>
                        </GridItem>
                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color='danger'>
                              <p className={classes.cardTitleWhite}>
                                {t('report.planOfManagement')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      required
                                      label={t(
                                        'report.numberOfTreatmentsProvided'
                                      )}
                                      type='number'
                                      id={'numberOfTreatmentsProvided'}
                                      value={
                                        formik.values.numberOfTreatmentsProvided
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>

                                <GridItem xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      required
                                      label={t(
                                        'report.numberOfAdditionalTreatments'
                                      )}
                                      type='number'
                                      id={'numberOfAdditionalTreatments'}
                                      value={
                                        formik.values
                                          .numberOfAdditionalTreatments
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>

                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.frequency')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='frequency'
                                      name='frequency'
                                      value={formik.values.frequency}
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value='intensive'
                                        control={<Radio required />}
                                        label={t('report.intensive')}
                                      />
                                      <FormControlLabel
                                        value='periodic'
                                        control={<Radio />}
                                        label={t('report.periodic')}
                                      />
                                      <FormControlLabel
                                        value='prn'
                                        control={<Radio />}
                                        label={t('report.prn')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={'frequencySpecify'}
                                      value={formik.values.frequencySpecify}
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.objectives.title')}
                                    </FormLabel>
                                    <FormGroup>
                                      <GridContainer>
                                        <GridItem xs={12} lg={6}>
                                          <FormControlLabel
                                            checked={objectives.includes(
                                              'curativeCare'
                                            )}
                                            onChange={handleObjectivesChange}
                                            name='curativeCare'
                                            control={
                                              <Checkbox name='curativeCare' />
                                            }
                                            label={t(
                                              'report.objectives.curativeCare'
                                            )}
                                          />
                                        </GridItem>
                                        <GridItem xs={12} lg={6}>
                                          <FormControlLabel
                                            checked={objectives.includes(
                                              'rehabilitativeCare'
                                            )}
                                            onChange={handleObjectivesChange}
                                            name='rehabilitativeCare'
                                            control={
                                              <Checkbox name='rehabilitativeCare' />
                                            }
                                            label={t(
                                              'report.objectives.rehabilitativeCare'
                                            )}
                                          />
                                        </GridItem>
                                        <GridItem xs={12} lg={6}>
                                          <FormControlLabel
                                            checked={objectives.includes(
                                              'maintenanceCare'
                                            )}
                                            onChange={handleObjectivesChange}
                                            name='maintenanceCare'
                                            control={
                                              <Checkbox name='maintenanceCare' />
                                            }
                                            label={t(
                                              'report.objectives.maintenanceCare'
                                            )}
                                          />
                                        </GridItem>
                                        <GridItem xs={12} lg={6}>
                                          <FormControlLabel
                                            checked={objectives.includes(
                                              'primaryPrevention'
                                            )}
                                            onChange={handleObjectivesChange}
                                            name='primaryPrevention'
                                            control={
                                              <Checkbox name='primaryPrevention' />
                                            }
                                            label={t(
                                              'report.objectives.primaryPrevention'
                                            )}
                                          />
                                        </GridItem>
                                      </GridContainer>
                                    </FormGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.planOfManagement')}
                                    </FormLabel>
                                    <FormGroup>
                                      <GridContainer>
                                        {profile.profile.techniques?.map(
                                          (technique, i) => (
                                            <GridItem key={i} xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={planOfManagement.includes(
                                                  technique
                                                )}
                                                onChange={
                                                  handlePlanOfManagementChange
                                                }
                                                name={technique}
                                                control={
                                                  <Checkbox name={technique} />
                                                }
                                                label={t(
                                                  `report.techniques.${technique}`
                                                )}
                                              />
                                            </GridItem>
                                          )
                                        )}
                                      </GridContainer>
                                    </FormGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.other')}
                                      type='text'
                                      id={'planOfManagementOther'}
                                      value={
                                        formik.values.planOfManagementOther
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <h5>
                                      {t('report.activityRecommendation')}
                                    </h5>
                                    <TextField
                                      label={t(
                                        'report.currentEmploymentStatus'
                                      )}
                                      required
                                      type='text'
                                      id={'currentEmploymentStatus'}
                                      value={
                                        formik.values.currentEmploymentStatus
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.continueActivities')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='continueActivities'
                                      name='continueActivities'
                                      value={formik.values.continueActivities}
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value={t('report.no')}
                                        control={<Radio required />}
                                        label={t('report.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.yes')}
                                        control={<Radio />}
                                        label={t('report.yes')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={'continueActivitiesSpecify'}
                                      value={
                                        formik.values.continueActivitiesSpecify
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.functionalLimitation')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='functionalLimitation'
                                      name='functionalLimitation'
                                      value={formik.values.functionalLimitation}
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value={t('report.no')}
                                        control={<Radio required />}
                                        label={t('report.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.yes')}
                                        control={<Radio />}
                                        label={t('report.yes')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={'functionalLimitationSpecify'}
                                      value={
                                        formik.values
                                          .functionalLimitationSpecify
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                    component='fieldset'
                                  >
                                    <FormLabel component='legend'>
                                      {t('report.reference.title')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label='reference'
                                      name='reference'
                                      value={formik.values.reference}
                                      onChange={(e) => {
                                        handleReference(e.target.value);
                                        formik.handleChange(e);
                                      }}
                                    >
                                      <FormControlLabel
                                        value={t('report.reference.no')}
                                        control={<Radio required />}
                                        label={t('report.reference.no')}
                                      />
                                      <FormControlLabel
                                        value={t('report.reference.emergency')}
                                        control={<Radio />}
                                        label={t('report.reference.emergency')}
                                      />
                                      <FormControlLabel
                                        value={t('report.reference.urgent')}
                                        control={<Radio />}
                                        label={t('report.reference.urgent')}
                                      />
                                      <FormControlLabel
                                        value={t('report.reference.soon')}
                                        control={<Radio />}
                                        label={t('report.reference.soon')}
                                      />
                                    </RadioGroup>
                                  </FormControl>
                                </GridItem>
                                {displayReferences && (
                                  <>
                                    <GridItem xs={12}>
                                      <FormControl
                                        fullWidth
                                        className={inputClasses.formControl}
                                        component='fieldset'
                                      >
                                        <FormLabel component='legend'>
                                          {t('report.reference.to')}
                                        </FormLabel>
                                        <FormGroup>
                                          <GridContainer>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'acupuncture'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='acupuncture'
                                                control={
                                                  <Checkbox name='acupuncture' />
                                                }
                                                label={t(
                                                  'report.reference.acupuncture'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'chiropractic'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='chiropractic'
                                                control={
                                                  <Checkbox name='chiropractic' />
                                                }
                                                label={t(
                                                  'report.reference.chiropractic'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'exerciseTherapy'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='exerciseTherapy'
                                                control={
                                                  <Checkbox name='exerciseTherapy' />
                                                }
                                                label={t(
                                                  'report.reference.exerciseTherapy'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'emergencyRoom'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='emergencyRoom'
                                                control={
                                                  <Checkbox name='emergencyRoom' />
                                                }
                                                label={t(
                                                  'report.reference.emergencyRoom'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'medecine'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='medecine'
                                                control={
                                                  <Checkbox name='medecine' />
                                                }
                                                label={t(
                                                  'report.reference.medecine'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'nutrition'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='nutrition'
                                                control={
                                                  <Checkbox name='nutrition' />
                                                }
                                                label={t(
                                                  'report.reference.nutrition'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'occupationalTherapy'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='occupationalTherapy'
                                                control={
                                                  <Checkbox name='occupationalTherapy' />
                                                }
                                                label={t(
                                                  'report.reference.occupationalTherapy'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'pharmacy'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='pharmacy'
                                                control={
                                                  <Checkbox name='pharmacy' />
                                                }
                                                label={t(
                                                  'report.reference.pharmacy'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'physicalTherapy'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='physicalTherapy'
                                                control={
                                                  <Checkbox name='physicalTherapy' />
                                                }
                                                label={t(
                                                  'report.reference.physicalTherapy'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'podiatry'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='podiatry'
                                                control={
                                                  <Checkbox name='podiatry' />
                                                }
                                                label={t(
                                                  'report.reference.podiatry'
                                                )}
                                              />
                                            </GridItem>
                                            <GridItem xs={12} lg={6}>
                                              <FormControlLabel
                                                checked={referenceList.includes(
                                                  'psychology'
                                                )}
                                                onChange={
                                                  handleReferenceListChange
                                                }
                                                name='psychology'
                                                control={
                                                  <Checkbox name='psychology' />
                                                }
                                                label={t(
                                                  'report.reference.psychology'
                                                )}
                                              />
                                            </GridItem>
                                          </GridContainer>
                                        </FormGroup>
                                      </FormControl>
                                    </GridItem>
                                    <GridItem xs={12}>
                                      <FormControl
                                        fullWidth
                                        className={inputClasses.formControl}
                                      >
                                        <TextField
                                          label={t('report.reference.other')}
                                          type='text'
                                          id={'referenceListOther'}
                                          value={
                                            formik.values.referenceListOther
                                          }
                                          onChange={formik.handleChange}
                                        />
                                      </FormControl>
                                    </GridItem>
                                    <GridItem xs={12}>
                                      <FormControl
                                        fullWidth
                                        className={inputClasses.formControl}
                                      >
                                        <TextField
                                          label={t('report.reference.reason')}
                                          type='text'
                                          id={'referenceListReason'}
                                          value={
                                            formik.values.referenceListReason
                                          }
                                          onChange={formik.handleChange}
                                        />
                                      </FormControl>
                                    </GridItem>
                                  </>
                                )}
                              </GridContainer>
                            </CardBody>
                          </Card>
                        </GridItem>

                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color='danger'>
                              <p className={classes.cardTitleWhite}>
                                {t('report.prognosis')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <Typography
                                      id='discrete-slider'
                                      gutterBottom
                                    >
                                      {t('report.gecc')}
                                    </Typography>
                                    <Slider
                                      required
                                      onChange={(element, value) =>
                                        formik.setFieldValue(
                                          'globalExpectationOfClinicalChange',
                                          value
                                        )
                                      }
                                      defaultValue={0}
                                      value={
                                        formik.values
                                          .globalExpectationOfClinicalChange
                                      }
                                      aria-labelledby='discrete-slider'
                                      valueLabelDisplay='auto'
                                      step={1}
                                      min={0}
                                      max={10}
                                    />
                                  </FormControl>
                                </GridItem>
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.specify')}
                                      type='text'
                                      id={
                                        'globalExpectationOfClinicalChangeSpecify'
                                      }
                                      value={
                                        formik.values
                                          .globalExpectationOfClinicalChangeSpecify
                                      }
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                          </Card>

                          <GridContainer>
                            <GridItem xs={12}>
                              <Button
                                onClick={() => history.goBack()}
                                color='danger'
                              >
                                {t('professional.patient.back')}
                              </Button>
                              <Button
                                color='success'
                                type='submit'
                                style={{ marginLeft: 15 }}
                              >
                                {t('professional.invite.submit')}
                              </Button>
                            </GridItem>
                          </GridContainer>
                        </GridItem>
                      </GridContainer>
                    </form>
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
};

NewReEvaluationReport.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
  sendReEvaluationReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getPatient,
  getCurrentProfile,
  sendReEvaluationReport,
})(withRouter(NewReEvaluationReport));

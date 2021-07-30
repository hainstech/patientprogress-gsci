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

  const [intake, setIntake] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [planOfManagement, setPlanOfManagement] = useState([]);

  const [oldReportInput, setOldReportInput] = useState({
    diagnosis: '',
    additionalDiagnosis: '',
    frequency: '',
    planOfManagementOther: '',
    planOfManagementExternalConsultation: '',
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
          frequency: lastReport.frequency,
          planOfManagementOther: lastReport.planOfManagementOther?.join(', '),
          planOfManagementExternalConsultation:
            lastReport.planOfManagementExternalConsultation,
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
      diagnosis: oldReportInput.diagnosis,
      additionalDiagnosis: oldReportInput.additionalDiagnosis,
      comments: '',
      numberOfTreatmentsProvided: '',
      numberOfAdditionalTreatments: '',
      frequency: oldReportInput.frequency,
      planOfManagementOther: oldReportInput.planOfManagementOther,
      planOfManagementExternalConsultation:
        oldReportInput.planOfManagementExternalConsultation,
      globalImpressionOfClinicalChange: 0,
      globalExpectationOfClinicalChange: 0,
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
          <GridItem xs={12} lg={11}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('report.newReEvaluationReport')}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
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
                        {t('report.age')}: {intake.age}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.date')}: {format(intake.date, 'yyyy/MM/dd')}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.initialReportDate')}:{' '}
                        {format(intake.initialReportDate, 'yyyy/MM/dd')}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.professional')}: {intake.professionalName}
                      </GridItem>
                      <GridItem xs={12}>
                        {/* #TODO Translate the profession */}
                        {t('report.profession')}:{' '}
                        {intake.professionalProfession}
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.chiefComplaint')}: {intake.chiefComplaint}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.onsetDate')}: {intake.chiefComplaintStart}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.initialGlobalExpectationOfClinicalChange')}:{' '}
                        {intake.initialGlobalExpectationOfClinicalChange}
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
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {intake.comorbidities.length === 0 &&
                          'No commorbidities'}
                        {intake.comorbidities.length > 0 &&
                          intake.comorbidities.map((comorbidity, i) => (
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
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        {t('report.redFlags')}:{' '}
                        {intake.redFlags.toString()
                          ? intake.redFlags.join(', ')
                          : 'None'}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        <strong>{t('report.relevantScores')}: </strong>
                        {intake.relevantScore.length === 0 && <p>None</p>}
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
                                            `professional.patient.score.${value.toLowerCase()}`
                                          )}
                                    </GridItem>
                                    {improvement && (
                                      <GridItem xs={12}>
                                        {t('report.improvement')}:{' '}
                                        {Math.round(improvement)}%
                                      </GridItem>
                                    )}
                                  </React.Fragment>
                                )
                              )}
                            </GridContainer>
                          ))}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <strong>{t('report.improvement')}</strong>
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.improvementPain')}: {intake.improvementPain}
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
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <strong>{t('report.satisfaction')}</strong>
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
                  </GridItem>

                  <form onSubmit={formik.handleSubmit}>
                    <GridItem xs={12}>
                      <GridContainer>
                        <GridItem xs={12} sm={12}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              label={t('report.comments')}
                              type='text'
                              id={'comments'}
                              value={formik.values.comments}
                              onChange={formik.handleChange}
                            />
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12} sm={6}>
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

                        <GridItem xs={12} sm={6}>
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

                        <GridItem xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              required
                              label={t('report.numberOfTreatmentsProvided')}
                              type='number'
                              id={'numberOfTreatmentsProvided'}
                              value={formik.values.numberOfTreatmentsProvided}
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
                              label={t('report.numberOfAdditionalTreatments')}
                              type='number'
                              id={'numberOfAdditionalTreatments'}
                              value={formik.values.numberOfAdditionalTreatments}
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
                            component='fieldset'
                          >
                            <FormLabel component='legend'>
                              {t('report.objectives')}
                            </FormLabel>
                            <FormGroup>
                              <GridContainer>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes(
                                      'painRelieving'
                                    )}
                                    onChange={handleObjectivesChange}
                                    name='painRelieving'
                                    control={<Checkbox name='painRelieving' />}
                                    label={t('report.painRelieving')}
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes(
                                      'improveFunction'
                                    )}
                                    onChange={handleObjectivesChange}
                                    name='improveFunction'
                                    control={
                                      <Checkbox name='improveFunction' />
                                    }
                                    label={t('report.improveFunction')}
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes(
                                      'readaptation'
                                    )}
                                    onChange={handleObjectivesChange}
                                    name='readaptation'
                                    control={<Checkbox name='readaptation' />}
                                    label={t('report.readaptation')}
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes('maintenance')}
                                    onChange={handleObjectivesChange}
                                    name='maintenance'
                                    control={<Checkbox name='maintenance' />}
                                    label={t('report.maintenance')}
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes('prevention')}
                                    onChange={handleObjectivesChange}
                                    name='prevention'
                                    control={<Checkbox name='prevention' />}
                                    label={t('report.prevention')}
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes(
                                      'therapeuticTrial'
                                    )}
                                    onChange={handleObjectivesChange}
                                    name='therapeuticTrial'
                                    control={
                                      <Checkbox name='therapeuticTrial' />
                                    }
                                    label={t('report.therapeuticTrial')}
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
                                {profile.profile.manipulativeTechniques.map(
                                  (technique, i) => (
                                    <GridItem key={i} xs={12} lg={6}>
                                      <FormControlLabel
                                        checked={planOfManagement.includes(
                                          technique
                                        )}
                                        onChange={handlePlanOfManagementChange}
                                        name={technique}
                                        control={<Checkbox name={technique} />}
                                        label={t(
                                          `report.techniques.${technique}`
                                        )}
                                      />
                                    </GridItem>
                                  )
                                )}
                                {profile.profile.nonAdjustiveTechniques.map(
                                  (technique, i) => (
                                    <GridItem key={i} xs={12} lg={6}>
                                      <FormControlLabel
                                        checked={planOfManagement.includes(
                                          technique
                                        )}
                                        onChange={handlePlanOfManagementChange}
                                        name={technique}
                                        control={<Checkbox name={technique} />}
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
                              value={formik.values.planOfManagementOther}
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
                              label={t('report.externalConsultation')}
                              type='text'
                              id={'planOfManagementExternalConsultation'}
                              value={
                                formik.values
                                  .planOfManagementExternalConsultation
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
                            <Typography id='discrete-slider' gutterBottom>
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
                                formik.values.globalImpressionOfClinicalChange
                              }
                              aria-labelledby='discrete-slider'
                              valueLabelDisplay='auto'
                              step={1}
                              min={0}
                              max={10}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <Typography id='discrete-slider' gutterBottom>
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
                                formik.values.globalExpectationOfClinicalChange
                              }
                              aria-labelledby='discrete-slider'
                              valueLabelDisplay='auto'
                              step={1}
                              min={0}
                              max={10}
                            />
                          </FormControl>
                        </GridItem>
                      </GridContainer>
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
                  </form>
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

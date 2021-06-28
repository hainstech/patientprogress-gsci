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

import { getPatient, sendReport } from '../../actions/professional';
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

const getCommorbidities = (lastIntake) => {
  let comorbidities = [];
  Object.entries(lastIntake).forEach(([key, value]) => {
    switch (key) {
      case 'commorbidityHeart':
        if (
          lastIntake[key]['heartDisease'] === 'Oui' ||
          lastIntake[key]['heartDisease'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityBloodPressure':
        if (
          lastIntake[key]['highBloodPressure'] === 'Oui' ||
          lastIntake[key]['highBloodPressure'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityLungDisease':
        if (
          lastIntake[key]['lungDisease'] === 'Oui' ||
          lastIntake[key]['lungDisease'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityDiabetes':
        if (
          lastIntake[key]['diabetes'] === 'Oui' ||
          lastIntake[key]['diabetes'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityUlcer':
        if (
          lastIntake[key]['ulcerStomachDisease'] === 'Oui' ||
          lastIntake[key]['ulcerStomachDisease'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityKidney':
        if (
          lastIntake[key]['kidneyDisease'] === 'Oui' ||
          lastIntake[key]['kidneyDisease'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityLiver':
        if (
          lastIntake[key]['liverDisease'] === 'Oui' ||
          lastIntake[key]['liverDisease'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityAnemia':
        if (
          lastIntake[key]['anemia'] === 'Oui' ||
          lastIntake[key]['anemia'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityCancer':
        if (
          lastIntake[key]['cancer'] === 'Oui' ||
          lastIntake[key]['cancer'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityDepression':
        if (
          lastIntake[key]['depression'] === 'Oui' ||
          lastIntake[key]['depression'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityOsteoarthritis':
        if (
          lastIntake[key]['osteoarthritis'] === 'Oui' ||
          lastIntake[key]['osteoarthritis'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      case 'commorbidityRheumatoidArthritis':
        if (
          lastIntake[key]['rheumatoidArthritis'] === 'Oui' ||
          lastIntake[key]['rheumatoidArthritis'] === 'Yes'
        ) {
          comorbidities.push({
            name: key,
            treatment: lastIntake[key].treatment,
            activityLimitation: lastIntake[key].activityLimitation,
          });
        }
        break;
      default:
        break;
    }
  });
  return comorbidities;
};

const getRedFlags = (lastIntake) => {
  let redFlags = [];
  if (lastIntake.RFS_Fall === 'Oui' || lastIntake.RFS_Fall === 'Yes') {
    redFlags = [...redFlags, 'RFS_Fall'];
  }
  if (lastIntake.RFS_diagnosis && lastIntake.RFS_diagnosis.length > 0) {
    redFlags = [...redFlags, ...lastIntake.RFS_diagnosis];
  }
  if (lastIntake.RFS_suffered && lastIntake.RFS_suffered.length > 0) {
    redFlags = [...redFlags, ...lastIntake.RFS_suffered];
  }
  if (lastIntake.RFS_symptoms && lastIntake.RFS_symptoms.length > 0) {
    redFlags = [...redFlags, ...lastIntake.RFS_symptoms];
  }

  return redFlags;
};

const getRelevantScore = (lastIntake, questionnaires) => {
  // relevantScore: [
  //   {
  //     name: { type: String },
  //     score: [{ title: { type: String }, value: { type: String } }],
  //   },
  // ];
  let relevantScore = [];
  let last;
  let last2;
  let BPI;
  switch (lastIntake.chiefComplaintRegion) {
    case 'Cou':
    case 'Neck pain':
      last = getLastQuestionnaire(questionnaires, 'Neck Disability Index');
      BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
      if (BPI) {
        relevantScore.push({
          name: BPI.questionnaire.schema.title,
          score: BPI.score,
          date: BPI.time,
        });
      }
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
          date: last.time,
        });
      }
      break;
    case 'Bas du dos':
    case 'Low back pain':
      last = getLastQuestionnaire(questionnaires, 'Oswestry Disability Index');
      last2 = getLastQuestionnaire(
        questionnaires,
        'The Keele STarT Back Screening Tool'
      );
      BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
      if (BPI) {
        relevantScore.push({
          name: BPI.questionnaire.schema.title,
          score: BPI.score,
          date: BPI.time,
        });
      }
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
          date: last.time,
        });
      }
      if (last2) {
        relevantScore.push({
          name: last2.questionnaire.schema.title,
          score: last2.score,
          date: last2.time,
        });
      }
      break;
    case 'Membre supérieur (épaule, coude ou poignet)':
    case 'Upper extremity (shoulder, elbow or wrist)':
      last = getLastQuestionnaire(questionnaires, 'QuickDASH');
      BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
      if (BPI) {
        relevantScore.push({
          name: BPI.questionnaire.schema.title,
          score: BPI.score,
          date: BPI.time,
        });
      }
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
          date: last.time,
        });
      }
      break;

    case 'Membre inférieur (hanche,genou ou cheville)':
    case 'Lower extremity (hip, knee or ankle)':
      last = getLastQuestionnaire(
        questionnaires,
        'Lower Extremity Functional Scale (LEFS)'
      );
      BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
      if (BPI) {
        relevantScore.push({
          name: BPI.questionnaire.schema.title,
          score: BPI.score,
          date: BPI.time,
        });
      }
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
          date: last.time,
        });
      }
      break;
    case 'Aucune de ces régions':
    case 'Not in the options':
      BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
      if (BPI) {
        relevantScore.push({
          name: BPI.questionnaire.schema.title,
          score: BPI.score,
          date: BPI.time,
        });
      }
      break;
    default:
      break;
  }
  return relevantScore;
};

const NewReport = ({
  professional: { patient, loading },
  profile: { profile, loading: ploading },
  getCurrentProfile,
  match,
  getPatient,
  sendReport,
  history,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const [intake, setIntake] = useState({});
  const [objectives, setObjectives] = useState([]);
  const [planOfManagement, setPlanOfManagement] = useState([]);

  useEffect(() => {
    // Callback hell... sorry
    getCurrentProfile('professional').then((professional) =>
      getPatient(match.params.id).then((patient) => {
        const lastIntake = getLastQuestionnaire(
          patient.questionnaires,
          'Initial Intake Form'
        );
        setIntake({
          age: getAge(patient.dob),
          intakeUsed: lastIntake._id,
          date: new Date(),
          professionalName: professional.name,
          professionalProfession: professional.profession,
          // Social demographics
          civilStatus: lastIntake.answers.civilStatus,
          nbChildrens: lastIntake.answers.nbChildrens,
          // Work demographics
          occupation: lastIntake.answers.occupation,
          employmentStatus:
            lastIntake.answers.employmentStatusSelection.employmentStatus,
          physicalActivityVitalSign:
            lastIntake.answers.PAVSExercise *
            lastIntake.answers.PAVSExerciseMinutes,
          // Chief complaint
          chiefComplaint: lastIntake.answers.chiefComplaint,
          chiefComplaintRegion: lastIntake.answers.chiefComplaintRegion,
          chiefComplaintStart: lastIntake.answers.chiefComplaintStart,
          chiefComplaintAppear: lastIntake.answers.chiefComplaintAppear,
          chiefComplaintAppearDescription:
            lastIntake.answers.chiefComplaintAppearDescription,
          chiefComplaintEvolving: lastIntake.answers.chiefComplaintEvolving,
          chiefComplaintRecurrence: lastIntake.answers.chiefComplaintRecurrence,
          otherComplaints: lastIntake.answers.otherComplaints || '',
          comorbidities: getCommorbidities(lastIntake.answers),
          redFlags: getRedFlags(lastIntake.answers),
          // Facultative scores
          relevantScore: getRelevantScore(
            lastIntake.answers,
            patient.questionnaires
          ),
          // Quality of Life
          health: lastIntake.answers.health,
          qualityOfLife: lastIntake.answers.qualityOfLife,
          healthSatisfaction: lastIntake.answers.healthSatisfaction,
          globalExpectationOfChange:
            lastIntake.answers.globalExpectationOfChange,
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
      diagnosis: '',
      comments: '',
      numberOfTreatments: '',
      frequency: null,
      planOfManagementOther: '',
      planOfManagementExternalConsultation: '',
      globalExpectationOfClinicalChange: 0,
    },
    onSubmit: async (data) => {
      await sendReport(match.params.id, {
        ...data,
        ...intake,
        objectives,
        planOfManagement,
      });
      await getCurrentProfile('patient');
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
        <GridContainer justify='center'>
          <Alert />
          <GridItem xs={12} lg={8}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('report.newReport')}
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
                        {t('report.civilStatus')}: {intake.civilStatus}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.nbChildrens')}: {intake.nbChildrens}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.occupation')}: {intake.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.employmentStatus')}:{' '}
                        {intake.employmentStatus}
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
                        {t('report.onsetType')}: {intake.chiefComplaintAppear}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.injuryMechanism')}:{' '}
                        {intake.chiefComplaintAppearDescription}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.evolution')}: {intake.chiefComplaintEvolving}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.recurrence')}:{' '}
                        {intake.chiefComplaintRecurrence}
                      </GridItem>

                      {intake.otherComplaints && (
                        <GridItem xs={12}>
                          {t('report.secondaryComplaints')}:{' '}
                          {intake.otherComplaints}
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
                        {t('report.relevantScores')}:{' '}
                        {intake.relevantScore.length === 0 && 'None'}
                        {intake.relevantScore &&
                          intake.relevantScore.map((score, i) => (
                            <GridContainer key={i}>
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
                              {score.score.map(({ title, value }, y) => (
                                <GridItem key={y + i} xs={12}>
                                  {t(`report.scores.${title}`)}: {value}
                                </GridItem>
                              ))}
                            </GridContainer>
                          ))}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.healthQuality')}: {intake.health}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.qualityOfLife')}: {intake.qualityOfLife}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.healthSatisfaction')}:{' '}
                        {intake.healthSatisfaction}
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.gecPain')}:{' '}
                        {intake.globalExpectationOfChange.pain}/10
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.gecFunction')}:{' '}
                        {intake.globalExpectationOfChange.function}/10
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.gecQualityOfLife')}:{' '}
                        {intake.globalExpectationOfChange.qualityOfLife}/10
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <form onSubmit={formik.handleSubmit}>
                    <GridItem xs={12}>
                      <GridContainer>
                        <GridItem xs={12} sm={8}>
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
                        <GridItem xs={12} sm={4}>
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

                        <GridItem xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              required
                              label={t('report.nbTx')}
                              type='number'
                              id={'numberOfTreatments'}
                              value={formik.values.numberOfTreatments}
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
                        <GridItem xs={12} sm={5}>
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
                        <GridItem xs={12} sm={4}>
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
                              {t('report.gecc')}
                            </Typography>
                            <Slider
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
                            justify='center'
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

NewReport.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
  sendReport: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getPatient,
  getCurrentProfile,
  sendReport,
})(withRouter(NewReport));

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import {
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
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

import { getPatient } from '../../actions/professional';
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
          lastIntake['heartDisease'] === 'Yes'
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
          lastIntake['highBloodPressure'] === 'Yes'
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
          lastIntake['lungDisease'] === 'Yes'
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
          lastIntake['diabetes'] === 'Yes'
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
          lastIntake['ulcerStomachDisease'] === 'Yes'
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
          lastIntake['kidneyDisease'] === 'Yes'
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
          lastIntake['liverDisease'] === 'Yes'
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
          lastIntake['anemia'] === 'Yes'
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
          lastIntake['cancer'] === 'Yes'
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
          lastIntake['depression'] === 'Yes'
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
          lastIntake['osteoarthritis'] === 'Yes'
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
          lastIntake['rheumatoidArthritis'] === 'Yes'
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
  switch (lastIntake.chiefComplaintRegion) {
    case 'Cou':
    case 'Neck pain':
      last = getLastQuestionnaire(questionnaires, 'Neck Disability Index');
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
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
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
        });
      }
      if (last2) {
        relevantScore.push({
          name: last2.questionnaire.schema.title,
          score: last2.score,
        });
      }
      break;
    case 'Membre supérieur (épaule, coude ou poignet)':
    case 'Upper extremity (shoulder, elbow or wrist)':
      last = getLastQuestionnaire(questionnaires, 'QuickDASH');
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
        });
      }
      break;

    case 'Membre inférieur (hanche,genou ou cheville)':
    case 'Lower extremity (hip, knee or ankle)':
      last = getLastQuestionnaire(
        questionnaires,
        'Lower Extremity Functional Scale (LEFS)'
      );
      if (last) {
        relevantScore.push({
          name: last.questionnaire.schema.title,
          score: last.score,
        });
      }
      break;
    case 'Aucune de ces régions':
    case 'Not in the options':
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
          intakeUsed: lastIntake._id,
          date: new Date(),
          professionalName: professional.name,
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
      numberOfTreatments: '',
      frequency: null,
      planOfManagementOther: '',
      planOfManagementExternalConsultation: '',
    },
    onSubmit: (data) => {
      console.log(data);
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
                <h4 className={classes.cardTitleWhite}>New report</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        Patient's Name: {patient.name}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('professional.patient.gender')}:{' '}
                        {patient.gender === 'Male' ||
                        patient.gender === 'Female'
                          ? t(`professional.patient.${patient.gender}`)
                          : patient.gender}
                      </GridItem>
                      <GridItem xs={12}>Age: {getAge(patient.dob)}</GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        Date: {format(intake.date, 'yyyy/MM/dd')}
                      </GridItem>
                      <GridItem xs={12}>
                        Professional's Name: {profile.name}
                      </GridItem>
                      <GridItem xs={12}>
                        {/* #TODO Translate the profession */}
                        Profession: {profile.profession}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Civil status: {intake.civilStatus}
                      </GridItem>
                      <GridItem xs={12}>
                        Number of children: {intake.nbChildrens}
                      </GridItem>
                      <GridItem xs={12}>
                        Occupation: {intake.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        Employment status: {intake.employmentStatus}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Chief complaint: {intake.chiefComplaint}
                      </GridItem>
                      {intake.otherComplaints && (
                        <GridItem xs={12}>
                          Other complaints: {intake.otherComplaints}
                        </GridItem>
                      )}

                      <GridItem xs={12}>
                        Occupation: {intake.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        Employment status: {intake.employmentStatus}
                      </GridItem>
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
                                Comorbidity: {comorbidity.name}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.treatment}`}
                                xs={12}
                              >
                                Is receiving treatment: {comorbidity.treatment}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.activityLimitation}`}
                                xs={12}
                              >
                                Activity limitaion:{' '}
                                {comorbidity.activityLimitation}
                              </GridItem>
                            </GridContainer>
                          ))}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        Red flags:{' '}
                        {intake.redFlags.toString()
                          ? intake.redFlags.toString()
                          : 'None'}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Relevant scores:{' '}
                        {intake.relevantScore.length === 0 && 'None'}
                        {intake.relevantScore &&
                          intake.relevantScore.map((score, i) => (
                            <GridContainer key={i}>
                              <GridItem key={`${i}-${score.name}`} xs={12}>
                                {score.name}:
                              </GridItem>
                              {score.score.map(({ title, value }, y) => (
                                <GridItem key={y + i} xs={12}>
                                  {title}: {value}
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
                        Perceived health quality: {intake.health}
                      </GridItem>
                      <GridItem xs={12}>
                        Perceived quality of life: {intake.qualityOfLife}
                      </GridItem>
                      <GridItem xs={12}>
                        Perceived health satisfaction:{' '}
                        {intake.healthSatisfaction}
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Global expection of change (pain):{' '}
                        {intake.globalExpectationOfChange.pain}/10
                      </GridItem>
                      <GridItem xs={12}>
                        Global expection of change (function):{' '}
                        {intake.globalExpectationOfChange.function}/10
                      </GridItem>
                      <GridItem xs={12}>
                        Global expection of change (quality of life):{' '}
                        {intake.globalExpectationOfChange.qualityOfLife}/10
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <form onSubmit={formik.handleSubmit}>
                    <GridItem xs={12}>
                      <GridContainer>
                        <GridItem xs={12} sm={4}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              required
                              label='Number of treatments'
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
                              Treatment frequency
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
                                label='Intensive'
                              />
                              <FormControlLabel
                                value='periodic'
                                control={<Radio />}
                                label='Periodic'
                              />
                              <FormControlLabel
                                value='prn'
                                control={<Radio />}
                                label='PRN'
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
                              Objective(s)
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
                                    label='Pain relieving'
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
                                    label='Improve function'
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
                                    label='Readaptation'
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes('maintenance')}
                                    onChange={handleObjectivesChange}
                                    name='maintenance'
                                    control={<Checkbox name='maintenance' />}
                                    label='Maintenance'
                                  />
                                </GridItem>
                                <GridItem xs={12} lg={6}>
                                  <FormControlLabel
                                    checked={objectives.includes('prevention')}
                                    onChange={handleObjectivesChange}
                                    name='prevention'
                                    control={<Checkbox name='prevention' />}
                                    label='Prevention'
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
                                    label='Therapeutic trial'
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
                              Plan of Management
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
                                        label={technique}
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
                                        label={technique}
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
                              label='Other (separate by comma)'
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
                              label='External Consultation'
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
                        <GridItem xs={12}>
                          <Button color='success' type='submit'>
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
};

const mapStateToProps = (state) => ({
  professional: state.professional,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  getPatient,
  getCurrentProfile,
})(NewReport);

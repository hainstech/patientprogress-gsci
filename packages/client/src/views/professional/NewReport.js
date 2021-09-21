import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
// import ImageMapper from 'react-img-mapper';

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

// import URL from '../../assets/img/bodyMap.jpg';
import areasJSON from '../../assets/bodyMap.json';

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
  let relevantScore = [];
  const lowerBack = ['57', '58', '59', '60', '61', '62', '63', '64'];
  const neck = ['5', '6', '39', '40', '41', '42', '43', '44', '55', '56'];
  const upperLimb = [
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
    '51',
    '52',
    '53',
    '54',
  ];
  const lowerLimb = [
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '65',
    '66',
    '67',
    '68',
    '69',
    '70',
    '71',
    '72',
    '73',
    '74',
  ];

  if (lastIntake.relatedPainAreas.some((item) => lowerBack.includes(item))) {
    const ODI = getLastQuestionnaire(
      questionnaires,
      'Oswestry Disability Index'
    );
    const sb = getLastQuestionnaire(
      questionnaires,
      'The Keele STarT Back Screening Tool'
    );
    const BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
    if (BPI) {
      relevantScore.push({
        name: BPI.questionnaire.title,
        score: BPI.score,
        date: BPI.time,
      });
    }
    if (ODI) {
      relevantScore.push({
        name: ODI.questionnaire.title,
        score: ODI.score,
        date: ODI.time,
      });
    }
    if (sb) {
      relevantScore.push({
        name: sb.questionnaire.title,
        score: sb.score,
        date: sb.time,
      });
    }
  } else if (lastIntake.relatedPainAreas.some((item) => neck.includes(item))) {
    const NDI = getLastQuestionnaire(questionnaires, 'Neck Disability Index');
    const BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
    const sb = getLastQuestionnaire(
      questionnaires,
      'Modified MSK STarT Back Screening Tool'
    );
    if (sb) {
      relevantScore.push({
        name: sb.questionnaire.title,
        score: sb.score,
        date: sb.time,
      });
    }
    if (BPI) {
      relevantScore.push({
        name: BPI.questionnaire.title,
        score: BPI.score,
        date: BPI.time,
      });
    }
    if (NDI) {
      relevantScore.push({
        name: NDI.questionnaire.title,
        score: NDI.score,
        date: NDI.time,
      });
    }
  } else if (
    lastIntake.relatedPainAreas.some((item) => upperLimb.includes(item))
  ) {
    const dash = getLastQuestionnaire(questionnaires, 'QuickDASH');
    const BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
    const sb = getLastQuestionnaire(
      questionnaires,
      'Modified MSK STarT Back Screening Tool'
    );
    if (sb) {
      relevantScore.push({
        name: sb.questionnaire.title,
        score: sb.score,
        date: sb.time,
      });
    }
    if (BPI) {
      relevantScore.push({
        name: BPI.questionnaire.title,
        score: BPI.score,
        date: BPI.time,
      });
    }
    if (dash) {
      relevantScore.push({
        name: dash.questionnaire.title,
        score: dash.score,
        date: dash.time,
      });
    }
  } else if (
    lastIntake.relatedPainAreas.some((item) => lowerLimb.includes(item))
  ) {
    const LEFS = getLastQuestionnaire(
      questionnaires,
      'Lower Extremity Functional Scale (LEFS)'
    );
    const BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
    const sb = getLastQuestionnaire(
      questionnaires,
      'Modified MSK STarT Back Screening Tool'
    );
    if (sb) {
      relevantScore.push({
        name: sb.questionnaire.title,
        score: sb.score,
        date: sb.time,
      });
    }
    if (BPI) {
      relevantScore.push({
        name: BPI.questionnaire.title,
        score: BPI.score,
        date: BPI.time,
      });
    }
    if (LEFS) {
      relevantScore.push({
        name: LEFS.questionnaire.title,
        score: LEFS.score,
        date: LEFS.time,
      });
    }
  } else {
    const BPI = getLastQuestionnaire(questionnaires, 'Brief Pain Inventory');
    const sb = getLastQuestionnaire(
      questionnaires,
      'Modified MSK STarT Back Screening Tool'
    );
    if (sb) {
      relevantScore.push({
        name: sb.questionnaire.title,
        score: sb.score,
        date: sb.time,
      });
    }
    if (BPI) {
      relevantScore.push({
        name: BPI.questionnaire.title,
        score: BPI.score,
        date: BPI.time,
      });
    }
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
  const [
    displaySpinalDiagnosticClassification,
    setDisplaySpinalDiagnosticClassification,
  ] = useState(false);
  const [displayReferences, setDisplayReferences] = useState(false);
  const [referenceList, setReferenceList] = useState([]);

  useEffect(() => {
    // Callback hell... sorry
    getCurrentProfile('professional').then((professional) =>
      getPatient(match.params.id).then((patient) => {
        const lastIntake = getLastQuestionnaire(
          patient.questionnaires,
          'Initial Intake Form'
        );
        setIntake({
          dob: patient.dob,
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
          // Body maps
          allPainAreas: lastIntake.answers.allPainAreas,
          relatedPainAreas: lastIntake.answers.relatedPainAreas,
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

  const handleReferenceListChange = (event) => {
    if (referenceList.indexOf(event.target.name) > -1) {
      setReferenceList(referenceList.filter((id) => id !== event.target.name));
      return;
    }
    setReferenceList([...referenceList, event.target.name]);
  };

  const formik = useFormik({
    initialValues: {
      investigationResults: '',
      additionalInvestigation: null,
      additionalInvestigationSpecify: '',
      neckOrLowerBackCondition: null,
      spinalDiagnosticClassification: null,
      diagnosis: '',
      additionalDiagnosis: '',
      differentialDiagnosis: '',
      numberOfTreatments: '',
      frequency: null,
      frequencySpecify: '',
      planOfManagementOther: '',
      currentEmploymentStatus: '',
      continueActivities: null,
      continueActivitiesSpecify: '',
      functionalLimitation: null,
      functionalLimitationSpecify: '',
      reference: null,
      referenceListOther: '',
      referenceListReason: '',
      globalExpectationOfClinicalChange: 0,
      geccSpecify: '',
    },
    onSubmit: async (data) => {
      await sendReport(match.params.id, {
        ...data,
        ...intake,
        objectives,
        planOfManagement,
        referenceList,
      });
      history.goBack();
    },
  });

  const { t } = useTranslation();

  // const handleLoaded = () => {
  //   setDisabled(false);
  // };

  const handleNeckOrLowerBackCondition = (value) => {
    if (value === 'Yes' || value === 'Oui') {
      setDisplaySpinalDiagnosticClassification(true);
    } else {
      setDisplaySpinalDiagnosticClassification(false);
    }
  };

  const handleReference = (value) => {
    if (value === 'No' || value === 'Non') {
      setDisplayReferences(false);
    } else {
      setDisplayReferences(true);
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
        <GridContainer>
          <Alert />
          <GridItem xs={12}>
            <Card>
              <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>
                  {t('report.newReport')}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color="danger">
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
                      <CardHeader color="danger">
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
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color="danger">
                        <p className={classes.cardTitleWhite}>
                          {t('report.demographics')}
                        </p>
                      </CardHeader>
                      <CardBody>
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
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color="danger">
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
                            {t('report.onsetType')}:{' '}
                            {intake.chiefComplaintAppear}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.injuryMechanism')}:{' '}
                            {intake.chiefComplaintAppearDescription}
                          </GridItem>
                          <GridItem xs={12}>
                            {t('report.evolution')}:{' '}
                            {intake.chiefComplaintEvolving}
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
                      </CardBody>
                    </Card>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <Card>
                      <CardHeader color="danger">
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
                      <CardHeader color="danger">
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
                        <CardHeader color="danger">
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
                      <CardHeader color="danger">
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
                      <CardHeader color="danger">
                        <p className={classes.cardTitleWhite}>
                          {t('report.relevantScores')}
                        </p>
                      </CardHeader>
                      <CardBody>
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
                                  {t(`professional.patient.score.${title}`)}:{' '}
                                  {/\d/.test(value)
                                    ? value
                                    : t(`professional.patient.score.${value}`)}
                                </GridItem>
                              ))}
                            </GridContainer>
                          ))}
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
                      </CardBody>
                    </Card>
                  </GridItem>

                  <GridItem xs={12}>
                    <form onSubmit={formik.handleSubmit}>
                      <GridContainer>
                        <GridItem xs={12}>
                          <Card>
                            <CardHeader color="danger">
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
                                      type="text"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.additionalInvestigation')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="additionalInvestigation"
                                      name="additionalInvestigation"
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
                                      type="text"
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
                            <CardHeader color="danger">
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.neckOrLowerBackCondition')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="neckOrLowerBackCondition"
                                      name="neckOrLowerBackCondition"
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
                                      component="fieldset"
                                    >
                                      <FormLabel component="legend">
                                        {t(
                                          'report.spinalDiagnosticClassification.title'
                                        )}
                                      </FormLabel>

                                      <RadioGroup
                                        aria-label="spinalDiagnosticClassification"
                                        name="spinalDiagnosticClassification"
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
                                      type="text"
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
                                      type="text"
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
                                      type="text"
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
                            <CardHeader color="danger">
                              <p className={classes.cardTitleWhite}>
                                {t('report.currentEpisode')}
                              </p>
                            </CardHeader>
                            <CardBody>
                              <GridContainer>
                                <GridItem xs={12} sm={4}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      required
                                      label={t('report.nbTx')}
                                      type="number"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.frequency')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="frequency"
                                      name="frequency"
                                      value={formik.values.frequency}
                                      onChange={formik.handleChange}
                                    >
                                      <FormControlLabel
                                        value="intensive"
                                        control={<Radio required />}
                                        label={t('report.intensive')}
                                      />
                                      <FormControlLabel
                                        value="periodic"
                                        control={<Radio />}
                                        label={t('report.periodic')}
                                      />
                                      <FormControlLabel
                                        value="prn"
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
                                      type="text"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
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
                                            name="curativeCare"
                                            control={
                                              <Checkbox name="curativeCare" />
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
                                            name="rehabilitativeCare"
                                            control={
                                              <Checkbox name="rehabilitativeCare" />
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
                                            name="maintenanceCare"
                                            control={
                                              <Checkbox name="maintenanceCare" />
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
                                            name="primaryPrevention"
                                            control={
                                              <Checkbox name="primaryPrevention" />
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
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
                                <GridItem xs={12}>
                                  <FormControl
                                    fullWidth
                                    className={inputClasses.formControl}
                                  >
                                    <TextField
                                      label={t('report.other')}
                                      type="text"
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
                                      type="text"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.continueActivities')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="continueActivities"
                                      name="continueActivities"
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
                                      type="text"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.functionalLimitation')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="functionalLimitation"
                                      name="functionalLimitation"
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
                                      type="text"
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
                                    component="fieldset"
                                  >
                                    <FormLabel component="legend">
                                      {t('report.reference.title')}
                                    </FormLabel>

                                    <RadioGroup
                                      aria-label="reference"
                                      name="reference"
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
                                        component="fieldset"
                                      >
                                        <FormLabel component="legend">
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
                                                name="acupuncture"
                                                control={
                                                  <Checkbox name="acupuncture" />
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
                                                name="chiropractic"
                                                control={
                                                  <Checkbox name="chiropractic" />
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
                                                name="exerciseTherapy"
                                                control={
                                                  <Checkbox name="exerciseTherapy" />
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
                                                name="emergencyRoom"
                                                control={
                                                  <Checkbox name="emergencyRoom" />
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
                                                name="medecine"
                                                control={
                                                  <Checkbox name="medecine" />
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
                                                name="nutrition"
                                                control={
                                                  <Checkbox name="nutrition" />
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
                                                name="occupationalTherapy"
                                                control={
                                                  <Checkbox name="occupationalTherapy" />
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
                                                name="pharmacy"
                                                control={
                                                  <Checkbox name="pharmacy" />
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
                                                name="physicalTherapy"
                                                control={
                                                  <Checkbox name="physicalTherapy" />
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
                                                name="podiatry"
                                                control={
                                                  <Checkbox name="podiatry" />
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
                                                name="psychology"
                                                control={
                                                  <Checkbox name="psychology" />
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
                                          type="text"
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
                                          type="text"
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
                            <CardHeader color="danger">
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
                                      id="discrete-slider"
                                      gutterBottom
                                    >
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
                                        formik.values
                                          .globalExpectationOfClinicalChange
                                      }
                                      aria-labelledby="discrete-slider"
                                      valueLabelDisplay="auto"
                                      step={1}
                                      min={-10}
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
                                      type="text"
                                      id={'geccSpecify'}
                                      value={formik.values.geccSpecify}
                                      onChange={formik.handleChange}
                                    />
                                  </FormControl>
                                </GridItem>
                              </GridContainer>
                            </CardBody>
                          </Card>
                        </GridItem>
                        <GridItem xs={12}>
                          <GridContainer>
                            <GridItem xs={12}>
                              <Button
                                onClick={() => history.goBack()}
                                color="danger"
                              >
                                {t('professional.patient.back')}
                              </Button>
                              <Button
                                color="success"
                                type="submit"
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

import React, { Fragment, useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { useFormik } from 'formik';

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
  Switch,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { editProfile, getCurrentProfile } from '../../actions/profile';
import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';
import ProfessionalConsent from '../auth/ProfessionalConsent';

import { countries } from '../../assets/countries';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useStyles = makeStyles(styles);
const useInputStyles = makeStyles(inputStyles);

const useCountryInputStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});

let techniquesIds = [
  'blairAnalysisAndAdjustingTechnique',
  'cranialTherapy',
  'diversifiedTechnique',
  'extremityManipulating/Adjusting',
  'fullSpineSpecificChiropracticTechnique',
  'gonsteadTechnique',
  'manualMobilisation &Traction',
  'mcTimoney',
  'nationalUpperCervicalChiropracticAssociation',
  'pediatricAdjustment',
  'petitbonAdjustingInstrument &Technique',
  'touchAndHoldTechnique',
  'activatorAdjustingInstrument &Technique',
  'appliedSpinalBiomechanicalEngineering',
  'arthroStim',
  'atlasOrthogonalSweatAdustingInstrumentTechnique',
  'coxTechnique',
  'impulseAdjustingInstrument',
  'jenneticsProcedureAndInstrument',
  'leanderTechnique',
  'neuroImpulseProtocol',
  'neuroVertebralDecompressionTherapy',
  'pierceResultsSystem',
  'proAdjusterSigmaInstruments',
  'pulStarSystem',
  'sacroOccipitalTechnique',
  'thompsonTechnique',
  'toftnessAdjustingTechnique',
  'toggleRecoilTechnique',
  'torqueReleaseTechniqueAndInstrument',
  'activeReleaseTechnique',
  'crossFiberFrictionTechnique',
  'cryotherapy',
  'dryNeedlingTherapy/acupuncture',
  'electrotherapy',
  'graston',
  'heatTherapy',
  'highPowerLaserTherapy',
  'instrumentAssistedSoftTissueMobilization',
  'kinesiotaping',
  'lowLevelLaserTherapy',
  'massage',
  'muscleEnergyTechnique',
  'myofascialRelease',
  'nimmo',
  'pinAndReleaseTechnique',
  'shockwaveTherapy',
  'spray &StetchTechnique',
  'strain/counterStrainTechnique',
  'therapeuticVibration',
  'triggerPointTherapy &IschemicCompression',
  'ultrasoundTherapy',
  'webster',
  'bioEnergeticSynchronizationTechnique',
  'bioGeometricIntegration',
  'chiropracticManipulativeReflexTechnique',
  'directionalNonForceTechniqueVanRumpt',
  'korenSpecificTechnique',
  'loganBasicTechnique',
  'networkSpinalAnalysis',
  'neuroEmotionalTechnique',
  'talskyTonalChiropractic',
  'tonalIntegrativeTechnique',
  'education',
  'ergonomicAdvices',
  'exercisePrescription',
  'footOrthotics',
  'herbalMedicine',
  'nutritionalPrescription',
  'orthotics &Brace',
  'psychosocialRiskFactorManagement',
  'weightReductionProgram',
  'appliedKinesiology',
  'chiropracticBioPhysics',
  'exerciseSupervision',
  'functionalNeurology',
];

// ISO 3166-1 alpha-2
// ⚠️ No support for IE 11
function countryToFlag(isoCode) {
  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        )
    : isoCode;
}

const TechniqueItem = ({ id, techniques, handleTechniquesChange, t }) => (
  <GridItem xs={12} lg={6}>
    <FormControlLabel
      checked={techniques.includes(id)}
      onChange={handleTechniquesChange}
      name={id}
      control={<Checkbox name={id} />}
      label={t(`report.techniques.${id}`)}
    />
  </GridItem>
);

const SectionTitle = ({ title, t }) => (
  <GridItem xs={12} style={{ marginTop: 15 }}>
    <FormLabel component="legend">
      {t(`report.techniques.categories.${title}`)}
    </FormLabel>
  </GridItem>
);

const Preferences = ({
  profile: { profile, loading },
  editProfile,
  getCurrentProfile,
  history,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();
  const countryInputStyles = useCountryInputStyles();
  const { t } = useTranslation();

  const [otherDegree, setOtherDegree] = useState([]);
  const [techniques, setTechniques] = useState([]);
  const [consentData, setConsentData] = useState({});

  useEffect(() => {
    if (!profile) getCurrentProfile('professional');
    if (!loading && profile) {
      setConsentData({
        dataConsent: profile.dataConsent,
        participantConsent: profile.participantConsent,
      });
      formik.setFieldValue('name', !profile.name ? '' : profile.name);
      formik.setFieldValue('clinic', !profile.clinic ? '' : profile.clinic);
      formik.setFieldValue(
        'description',
        !profile.description ? '' : profile.description
      );
      formik.setFieldValue('terms', profile.terms);
      formik.setFieldValue('phone', !profile.phone ? '' : profile.phone);
      formik.setFieldValue(
        'language',
        !profile.language ? '' : profile.language
      );
      profile.profile.yearOfBirth &&
        formik.setFieldValue('yearOfBirth', profile.profile.yearOfBirth);
      profile.profile.yearDegree &&
        formik.setFieldValue('yearDegree', profile.profile.yearDegree);
      profile.profile.college &&
        formik.setFieldValue('college', profile.profile.college);
      profile.profile.otherDegreeSpecify &&
        formik.setFieldValue(
          'otherDegreeSpecify',
          profile.profile.otherDegreeSpecify
        );
      profile.profile.averagePatientsVisits &&
        formik.setFieldValue(
          'averagePatientsVisits',
          profile.profile.averagePatientsVisits
        );
      profile.profile.averageNewPatients &&
        formik.setFieldValue(
          'averageNewPatients',
          profile.profile.averageNewPatients
        );
      profile.profile.country &&
        formik.setFieldValue('country', profile.profile.country);
      profile.profile.meanNbPatients &&
        formik.setFieldValue('meanNbPatients', profile.profile.meanNbPatients);
      profile.profile.practiceDescription &&
        formik.setFieldValue(
          'practiceDescription',
          profile.profile.practiceDescription
        );
      profile.profile.radiologyService &&
        formik.setFieldValue(
          'radiologyService',
          profile.profile.radiologyService
        );
      setOtherDegree(
        !profile.profile.otherDegree ? [] : profile.profile.otherDegree
      );
      setTechniques(
        !profile.profile.techniques ? [] : profile.profile.techniques
      );
    }
    // eslint-disable-next-line
  }, [loading, getCurrentProfile, profile]);

  const handleDegreeChange = (event) => {
    if (otherDegree.indexOf(event.target.name) > -1) {
      setOtherDegree(otherDegree.filter((id) => id !== event.target.name));
      return;
    }
    setOtherDegree([...otherDegree, event.target.name]);
  };

  const handleTechniquesChange = (event) => {
    console.log(techniques);
    if (techniques.indexOf(event.target.name) > -1) {
      setTechniques(techniques.filter((id) => id !== event.target.name));
      return;
    }
    setTechniques([...techniques, event.target.name]);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      clinic: '',
      description: '',
      phone: '',
      language: '',
      terms: false,
      yearOfBirth: '',
      yearDegree: '',
      country: null,
      college: '',
      otherDegreeSpecify: '',
      averagePatientsVisits: '',
      averageNewPatients: '',
      practiceDescription: '',
      radiologyService: '',
    },
    onSubmit: async (data) => {
      await editProfile(
        'professional',
        {
          ...data,
          otherDegree,
          techniques,
          ...consentData,
        },
        history
      );
      await getCurrentProfile('professional');
    },
  });

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent="center">
          <GridItem xs={12} lg={8}>
            <Alert />
            <Card>
              <CardHeader color="danger">
                <h4 className={classes.cardTitleWhite}>
                  {t('professional.preferences.title')}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {t('professional.preferences.description')}
                </p>
              </CardHeader>
              <form onSubmit={formik.handleSubmit}>
                <CardBody>
                  <h5>{t('professional.preferences.aboutYourself')}</h5>
                  <GridContainer>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.name')}
                          type="text"
                          id={'name'}
                          value={formik.values.name}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.clinic')}
                          type="text"
                          id={'clinic'}
                          value={formik.values.clinic}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.phone')}
                          type="text"
                          id={'phone'}
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.yourDescription')}
                          type="text"
                          id={'description'}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={4}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor="language"
                        >
                          {t('professional.preferences.language')}
                        </InputLabel>

                        <NativeSelect
                          value={formik.values.language}
                          onChange={formik.handleChange}
                          inputProps={{
                            type: 'text',
                            id: 'language',
                          }}
                        >
                          <option value="" defaultValue disabled></option>
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                        </NativeSelect>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={4}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.yearOfBirth')}
                          type="text"
                          id={'yearOfBirth'}
                          value={formik.values.yearOfBirth}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
                      <br />
                      <ProfessionalConsent
                        setConsentData={setConsentData}
                        consentData={consentData}
                      />
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControlLabel
                        className={inputClasses.formControl}
                        control={
                          <Switch
                            id={'terms'}
                            checked={formik.values.terms}
                            onChange={formik.handleChange}
                            name="terms"
                          />
                        }
                        label={
                          <p>
                            {t('register.consent')}{' '}
                            <a
                              href="https://app.patientprogress.ca/privacy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('privacyPolicyTitle')}
                            </a>{' '}
                            &{' '}
                            <a
                              href="https://app.patientprogress.ca/terms"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('termsOfUseTitle')}
                            </a>
                          </p>
                        }
                      />
                    </GridItem>
                  </GridContainer>
                  {formik.values.terms && (
                    <>
                      <h5>{t('professional.preferences.about')}</h5>
                      <GridContainer>
                        <GridItem xs={12} lg={6}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              label={t('professional.preferences.yearDegree')}
                              type="text"
                              id={'yearDegree'}
                              value={formik.values.yearDegree}
                              onChange={formik.handleChange}
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} lg={6}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <Autocomplete
                              id="country-select"
                              options={countries}
                              classes={{
                                option: countryInputStyles.option,
                              }}
                              autoHighlight
                              getOptionLabel={(option) =>
                                option.label ? option.label : ''
                              }
                              getOptionSelected={(option) =>
                                option.label
                                  ? option.label === formik.values.country.label
                                  : option.label === ''
                              }
                              renderOption={(option) => (
                                <>
                                  <span>{countryToFlag(option.code)}</span>
                                  {option.label} ({option.code})
                                </>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label={t('professional.preferences.country')}
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                  }}
                                />
                              )}
                              value={formik.values.country}
                              onChange={(e, value) =>
                                formik.setFieldValue(
                                  'country',
                                  value ? value : null
                                )
                              }
                            />
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} lg={12}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              label={t('professional.preferences.college')}
                              type="text"
                              id={'college'}
                              value={formik.values.college}
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
                              {t('professional.preferences.otherDegree')}
                            </FormLabel>
                            <FormGroup>
                              <FormControlLabel
                                checked={otherDegree.includes('BSc degree')}
                                onChange={handleDegreeChange}
                                name="BSc degree"
                                control={<Checkbox name="BSc degree" />}
                                label={t('professional.preferences.bsc')}
                              />
                              <FormControlLabel
                                checked={otherDegree.includes('MSc degree')}
                                onChange={handleDegreeChange}
                                name="MSc degree"
                                control={<Checkbox name="MSc degree" />}
                                label={t('professional.preferences.msc')}
                              />
                              <FormControlLabel
                                checked={otherDegree.includes('PhD degree')}
                                onChange={handleDegreeChange}
                                name="PhD degree"
                                control={<Checkbox name="PhD degree" />}
                                label={t('professional.preferences.phd')}
                              />
                              <FormControlLabel
                                checked={otherDegree.includes(
                                  'Chiropractic specialty degree'
                                )}
                                onChange={handleDegreeChange}
                                name="Chiropractic specialty degree"
                                control={
                                  <Checkbox name="Chiropractic specialty degree" />
                                }
                                label={t(
                                  'professional.preferences.chiropracticSpecialtyDegree'
                                )}
                              />
                              <FormControlLabel
                                checked={otherDegree.includes(
                                  'Post graduate diploma / micro-program'
                                )}
                                onChange={handleDegreeChange}
                                name="Post graduate diploma / micro-program"
                                control={
                                  <Checkbox name="Post graduate diploma / micro-program" />
                                }
                                label={t(
                                  'professional.preferences.postGraduateDiploma'
                                )}
                              />
                            </FormGroup>
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12} lg={12}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                          >
                            <TextField
                              label={t('report.specify')}
                              type="text"
                              id={'otherDegreeSpecify'}
                              value={formik.values.otherDegreeSpecify}
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
                              label={t(
                                'professional.preferences.averagePatientsVisits'
                              )}
                              type="number"
                              id={'averagePatientsVisits'}
                              value={formik.values.averagePatientsVisits}
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
                              label={t(
                                'professional.preferences.averageNewPatients'
                              )}
                              type="number"
                              id={'averageNewPatients'}
                              value={formik.values.averageNewPatients}
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
                              {t('professional.preferences.describe')}
                            </FormLabel>

                            <RadioGroup
                              aria-label="practice description"
                              name="practiceDescription"
                              value={formik.values.practiceDescription}
                              onChange={formik.handleChange}
                            >
                              <FormControlLabel
                                value="Solo practitioner"
                                control={<Radio />}
                                label={t('professional.preferences.solo')}
                              />
                              <FormControlLabel
                                value="Other chiropractor(s) at practice"
                                control={<Radio />}
                                label={t(
                                  'professional.preferences.otherChiros'
                                )}
                              />
                              <FormControlLabel
                                value="Other non-chiropractic healthcare practitioner available at same location"
                                control={<Radio />}
                                label={t(
                                  'professional.preferences.otherNonChiropractic'
                                )}
                              />
                            </RadioGroup>
                          </FormControl>
                        </GridItem>
                        <GridItem xs={12}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                            component="fieldset"
                          >
                            <FormLabel component="legend">
                              {t('professional.preferences.radiologyService')}
                            </FormLabel>

                            <RadioGroup
                              aria-label="radiologyService"
                              name="radiologyService"
                              value={formik.values.radiologyService}
                              onChange={formik.handleChange}
                            >
                              <FormControlLabel
                                value={t('report.no')}
                                control={<Radio />}
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
                      </GridContainer>
                      <GridContainer>
                        <GridItem xs={12}>
                          <FormControl
                            fullWidth
                            className={inputClasses.formControl}
                            component="fieldset"
                          >
                            <FormLabel component="legend">
                              {t('report.techniques.title')}
                            </FormLabel>
                            <FormGroup>
                              <GridContainer>
                                {techniquesIds.map((id) => (
                                  <React.Fragment key={id}>
                                    {id ===
                                      'blairAnalysisAndAdjustingTechnique' && (
                                      <SectionTitle title={'hvla'} t={t} />
                                    )}
                                    {id ===
                                      'activatorAdjustingInstrument &Technique' && (
                                      <SectionTitle
                                        title={'mechanicalAssisted'}
                                        t={t}
                                      />
                                    )}
                                    {id === 'activeReleaseTechnique' && (
                                      <SectionTitle
                                        title={'softTissue'}
                                        t={t}
                                      />
                                    )}
                                    {id ===
                                      'bioEnergeticSynchronizationTechnique' && (
                                      <SectionTitle title={'tonal'} t={t} />
                                    )}
                                    {id === 'education' && (
                                      <SectionTitle
                                        title={'recommendations'}
                                        t={t}
                                      />
                                    )}
                                    {id === 'appliedKinesiology' && (
                                      <SectionTitle title={'other'} t={t} />
                                    )}
                                    <TechniqueItem
                                      id={id}
                                      techniques={techniques}
                                      handleTechniquesChange={
                                        handleTechniquesChange
                                      }
                                      t={t}
                                    />
                                  </React.Fragment>
                                ))}
                              </GridContainer>
                            </FormGroup>
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                    </>
                  )}
                </CardBody>
                <CardFooter>
                  <Button color="success" type="submit">
                    {t('professional.preferences.submit')}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </Fragment>
  );
};

Preferences.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { editProfile, getCurrentProfile })(
  withRouter(Preferences)
);

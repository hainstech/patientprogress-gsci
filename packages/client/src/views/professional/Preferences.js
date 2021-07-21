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
  const [manipulativeTechniques, setManipulativeTechniques] = useState([]);
  const [nonAdjustiveTechniques, setNonAdjustiveTechniques] = useState([]);

  useEffect(() => {
    if (!profile) getCurrentProfile('professional');
    if (!loading && profile) {
      formik.setFieldValue('name', !profile.name ? '' : profile.name);
      formik.setFieldValue('clinic', !profile.clinic ? '' : profile.clinic);
      formik.setFieldValue(
        'description',
        !profile.description ? '' : profile.description
      );
      formik.setFieldValue('phone', !profile.phone ? '' : profile.phone);
      formik.setFieldValue(
        'language',
        !profile.language ? '' : profile.language
      );
      profile.profile.yearDegree &&
        formik.setFieldValue('yearDegree', profile.profile.yearDegree);
      profile.profile.country &&
        formik.setFieldValue('country', profile.profile.country);
      profile.profile.meanNbPatients &&
        formik.setFieldValue('meanNbPatients', profile.profile.meanNbPatients);
      profile.profile.practiceDescription &&
        formik.setFieldValue(
          'practiceDescription',
          profile.profile.practiceDescription
        );
      setOtherDegree(
        !profile.profile.otherDegree ? [] : profile.profile.otherDegree
      );
      setManipulativeTechniques(
        !profile.profile.manipulativeTechniques
          ? []
          : profile.profile.manipulativeTechniques
      );
      setNonAdjustiveTechniques(
        !profile.profile.nonAdjustiveTechniques
          ? []
          : profile.profile.nonAdjustiveTechniques
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

  const handleManipulativeTechniquesChange = (event) => {
    if (manipulativeTechniques.indexOf(event.target.name) > -1) {
      setManipulativeTechniques(
        manipulativeTechniques.filter((id) => id !== event.target.name)
      );
      return;
    }
    setManipulativeTechniques([...manipulativeTechniques, event.target.name]);
  };

  const handleNonAdjustiveTechniquesChange = (event) => {
    if (nonAdjustiveTechniques.indexOf(event.target.name) > -1) {
      setNonAdjustiveTechniques(
        nonAdjustiveTechniques.filter((id) => id !== event.target.name)
      );
      return;
    }
    setNonAdjustiveTechniques([...nonAdjustiveTechniques, event.target.name]);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      clinic: '',
      description: '',
      phone: '',
      language: '',
      yearDegree: '',
      country: null,
      meanNbPatients: '',
      practiceDescription: '',
    },
    onSubmit: async (data) => {
      await editProfile(
        'professional',
        {
          ...data,
          otherDegree,
          manipulativeTechniques,
          nonAdjustiveTechniques,
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
        <GridContainer justifyContent='center'>
          <GridItem xs={12} lg={8}>
            <Alert />
            <Card>
              <CardHeader color='danger'>
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
                          type='text'
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
                          type='text'
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
                          type='text'
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
                          type='text'
                          id={'description'}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12} lg={2}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor='language'
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
                          <option value='' defaultValue disabled></option>
                          <option value='en'>English</option>
                          <option value='fr'>Français</option>
                        </NativeSelect>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <h5>{t('professional.preferences.about')}</h5>
                  <GridContainer>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.yearDegree')}
                          type='text'
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
                          id='country-select'
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
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                        component='fieldset'
                      >
                        <FormLabel component='legend'>
                          {t('professional.preferences.otherDegree')}
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            checked={otherDegree.includes('BSc degree')}
                            onChange={handleDegreeChange}
                            name='BSc degree'
                            control={<Checkbox name='BSc degree' />}
                            label={t('professional.preferences.bsc')}
                          />
                          <FormControlLabel
                            checked={otherDegree.includes('MSc degree')}
                            onChange={handleDegreeChange}
                            name='MSc degree'
                            control={<Checkbox name='MSc degree' />}
                            label={t('professional.preferences.msc')}
                          />
                          <FormControlLabel
                            checked={otherDegree.includes('PhD degree')}
                            onChange={handleDegreeChange}
                            name='PhD degree'
                            control={<Checkbox name='PhD degree' />}
                            label={t('professional.preferences.phd')}
                          />
                          <FormControlLabel
                            checked={otherDegree.includes(
                              'Chiropractic specialty degree'
                            )}
                            onChange={handleDegreeChange}
                            name='Chiropractic specialty degree'
                            control={
                              <Checkbox name='Chiropractic specialty degree' />
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
                            name='Post graduate diploma / micro-program'
                            control={
                              <Checkbox name='Post graduate diploma / micro-program' />
                            }
                            label={t(
                              'professional.preferences.postGraduateDiploma'
                            )}
                          />
                        </FormGroup>
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label={t('professional.preferences.nbPatients')}
                          type='number'
                          id={'meanNbPatients'}
                          value={formik.values.meanNbPatients}
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
                          {t('professional.preferences.describe')}
                        </FormLabel>

                        <RadioGroup
                          aria-label='practice description'
                          name='practiceDescription'
                          value={formik.values.practiceDescription}
                          onChange={formik.handleChange}
                        >
                          <FormControlLabel
                            value='Solo practitioner'
                            control={<Radio />}
                            label={t('professional.preferences.solo')}
                          />
                          <FormControlLabel
                            value='Other chiropractor(s) at practice'
                            control={<Radio />}
                            label={t('professional.preferences.otherChiros')}
                          />
                          <FormControlLabel
                            value='Other non-chiropractic healthcare practitioner available at same location'
                            control={<Radio />}
                            label={t(
                              'professional.preferences.otherNonChiropractic'
                            )}
                          />
                        </RadioGroup>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <p>{t('professional.preferences.approach')}</p>
                  <GridContainer>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                        component='fieldset'
                      >
                        <FormLabel component='legend'>
                          {t('professional.preferences.manipulative')}
                        </FormLabel>
                        <FormGroup>
                          <GridContainer>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'diversified'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='diversified'
                                control={<Checkbox name='diversified' />}
                                label={t('report.techniques.diversified')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'extremityManipulating'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='extremityManipulating'
                                control={
                                  <Checkbox name='extremityManipulating' />
                                }
                                label={t(
                                  'report.techniques.extremityManipulating'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'activatorMethod'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='activatorMethod'
                                control={<Checkbox name='activatorMethod' />}
                                label={t('report.techniques.activatorMethod')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'arthroStim'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='arthroStim'
                                control={<Checkbox name='arthroStim' />}
                                label={t('report.techniques.arthroStim')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'impulseAdjustingInstrument'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='impulseAdjustingInstrument'
                                control={
                                  <Checkbox name='impulseAdjustingInstrument' />
                                }
                                label={t(
                                  'report.techniques.impulseAdjustingInstrument'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'gonstead'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='gonstead'
                                control={<Checkbox name='gonstead' />}
                                label={t('report.techniques.gonstead')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes('cox')}
                                onChange={handleManipulativeTechniquesChange}
                                name='cox'
                                control={<Checkbox name='cox' />}
                                label={t('report.techniques.cox')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'thompson'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='thompson'
                                control={<Checkbox name='thompson' />}
                                label={t('report.techniques.thompson')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes('sot')}
                                onChange={handleManipulativeTechniquesChange}
                                name='sot'
                                control={<Checkbox name='sot' />}
                                label={t('report.techniques.sot')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes('hio')}
                                onChange={handleManipulativeTechniquesChange}
                                name='hio'
                                control={<Checkbox name='hio' />}
                                label={t('report.techniques.hio')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'nimmo-tonus'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='nimmo-tonus'
                                control={<Checkbox name='nimmo-tonus' />}
                                label={t('report.techniques.nimmo-tonus')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'loganBasic'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='loganBasic'
                                control={<Checkbox name='loganBasic' />}
                                label={t('report.techniques.loganBasic')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'meric'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='meric'
                                control={<Checkbox name='meric' />}
                                label={t('report.techniques.meric')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'pierce-stillwagon'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='pierce-stillwagon'
                                control={<Checkbox name='pierce-stillwagon' />}
                                label={t('report.techniques.pierce-stillwagon')}
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
                          {t('professional.preferences.nonAdjustive')}
                        </FormLabel>
                        <FormGroup>
                          <GridContainer>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'mobilization'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='mobilization'
                                control={<Checkbox name='mobilization' />}
                                label={t('report.techniques.mobilization')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'graston'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='graston'
                                control={<Checkbox name='graston' />}
                                label={t('report.techniques.graston')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'myofascialRelease'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='myofascialRelease'
                                control={<Checkbox name='myofascialRelease' />}
                                label={t('report.techniques.myofascialRelease')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'ischemicCompression'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='ischemicCompression'
                                control={
                                  <Checkbox name='ischemicCompression' />
                                }
                                label={t(
                                  'report.techniques.ischemicCompression'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'massageTherapy'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='massageTherapy'
                                control={<Checkbox name='massageTherapy' />}
                                label={t('report.techniques.massageTherapy')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'motorizedTraction'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='motorizedTraction'
                                control={<Checkbox name='motorizedTraction' />}
                                label={t('report.techniques.motorizedTraction')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'formalPatientEducation'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='formalPatientEducation'
                                control={
                                  <Checkbox name='formalPatientEducation' />
                                }
                                label={t(
                                  'report.techniques.formalPatientEducation'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'ergonomicInstructions'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='ergonomicInstructions'
                                control={
                                  <Checkbox name='ergonomicInstructions' />
                                }
                                label={t(
                                  'report.techniques.ergonomicInstructions'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'nutritionalCounseling'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='nutritionalCounseling'
                                control={
                                  <Checkbox name='nutritionalCounseling' />
                                }
                                label={t(
                                  'report.techniques.nutritionalCounseling'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'exerciseInstruction'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='exerciseInstruction'
                                control={
                                  <Checkbox name='exerciseInstruction' />
                                }
                                label={t(
                                  'report.techniques.exerciseInstruction'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'cold'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='cold'
                                control={<Checkbox name='cold' />}
                                label={t('report.techniques.cold')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'heat'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='heat'
                                control={<Checkbox name='heat' />}
                                label={t('report.techniques.heat')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'orthotics'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='orthotics'
                                control={<Checkbox name='orthotics' />}
                                label={t('report.techniques.orthotics')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'orthopedicSupports'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='orthopedicSupports'
                                control={<Checkbox name='orthopedicSupports' />}
                                label={t(
                                  'report.techniques.orthopedicSupports'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'casting'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='casting'
                                control={<Checkbox name='casting' />}
                                label={t('report.techniques.casting')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'electricalStimulation'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='electricalStimulation'
                                control={
                                  <Checkbox name='electricalStimulation' />
                                }
                                label={t(
                                  'report.techniques.electricalStimulation'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'interferentialCurrent'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='interferentialCurrent'
                                control={
                                  <Checkbox name='interferentialCurrent' />
                                }
                                label={t(
                                  'report.techniques.interferentialCurrent'
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'directCurrent'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='directCurrent'
                                control={<Checkbox name='directCurrent' />}
                                label={t('report.techniques.directCurrent')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'diathermy'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='diathermy'
                                control={<Checkbox name='diathermy' />}
                                label={t('report.techniques.diathermy')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'ultrasound'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='ultrasound'
                                control={<Checkbox name='ultrasound' />}
                                label={t('report.techniques.directCurrent')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'acupuncture'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='acupuncture'
                                control={<Checkbox name='acupuncture' />}
                                label={t('report.techniques.acupuncture')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'dryNeedling'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='dryNeedling'
                                control={<Checkbox name='dryNeedling' />}
                                label={t('report.techniques.dryNeedling')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'shockwave'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='shockwave'
                                control={<Checkbox name='shockwave' />}
                                label={t('report.techniques.shockwave')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'coldLaser'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='coldLaser'
                                control={<Checkbox name='coldLaser' />}
                                label={t('report.techniques.coldLaser')}
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'other'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='other'
                                control={<Checkbox name='other' />}
                                label={t('report.techniques.other')}
                              />
                            </GridItem>
                          </GridContainer>
                        </FormGroup>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button color='success' type='submit'>
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

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
      // prob
      profile.profile.yearDegree &&
        formik.setFieldValue('yearDegree', profile.profile.yearDegree);
      profile.profile.country.label &&
        formik.setFieldValue('country', profile.profile.country);
      profile.profile.meanNbPatients &&
        formik.setFieldValue('meanNbPatients', profile.profile.meanNbPatients);
      // prob
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
        <GridContainer justify='center'>
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
                  <h5>About yourself</h5>
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
                  <h5>About your practice</h5>
                  <GridContainer>
                    <GridItem xs={12} lg={6}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <TextField
                          label='Year of chiropractic degree obtention'
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
                              label='Choose a country'
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
                          In addition to your chiropractic undergraduate degree,
                          have you completed
                        </FormLabel>
                        <FormGroup>
                          <FormControlLabel
                            checked={otherDegree.includes('BSc degree')}
                            onChange={handleDegreeChange}
                            name='BSc degree'
                            control={<Checkbox name='BSc degree' />}
                            label='BSc degree'
                          />
                          <FormControlLabel
                            checked={otherDegree.includes('MSc degree')}
                            onChange={handleDegreeChange}
                            name='MSc degree'
                            control={<Checkbox name='MSc degree' />}
                            label='MSc degree'
                          />
                          <FormControlLabel
                            checked={otherDegree.includes('PhD degree')}
                            onChange={handleDegreeChange}
                            name='PhD degree'
                            control={<Checkbox name='PhD degree' />}
                            label='PhD degree'
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
                            label='Chiropractic specialty degree'
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
                            label='Post graduate diploma / micro-program'
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
                          label='Your mean number of patient visit per week'
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
                          Describe your practice
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
                            label='Solo practitioner'
                          />
                          <FormControlLabel
                            value='Other chiropractor(s) at practice'
                            control={<Radio />}
                            label='Other chiropractor(s) at practice'
                          />
                          <FormControlLabel
                            value='Other non-chiropractic healthcare practitioner available at same location'
                            control={<Radio />}
                            label='Other non-chiropractic healthcare practitioner available at same location'
                          />
                        </RadioGroup>
                      </FormControl>
                    </GridItem>
                  </GridContainer>
                  <p>
                    Could you please indicate which treatment approach you use
                    most frequently. These treatment options will appear in the
                    section related to your patients Plan of Management.{' '}
                  </p>
                  <GridContainer>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                        component='fieldset'
                      >
                        <FormLabel component='legend'>
                          Manipulative / Ajustive techniques & procedure
                        </FormLabel>
                        <FormGroup>
                          <GridContainer>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Diversified'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Diversified'
                                control={<Checkbox name='Diversified' />}
                                label='Diversified'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Extremity Manipulating / Adjusting'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Extremity Manipulating / Adjusting'
                                control={
                                  <Checkbox name='Extremity Manipulating / Adjusting' />
                                }
                                label='Extremity Manipulating / Adjusting'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Adjustive Instrument: Activator method'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Adjustive Instrument: Activator method'
                                control={
                                  <Checkbox name='Adjustive Instrument: Activator method' />
                                }
                                label='Adjustive Instrument: Activator method'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Adjustive Instrument: ArthroStim'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Adjustive Instrument: ArthroStim'
                                control={
                                  <Checkbox name='Adjustive Instrument: ArthroStim' />
                                }
                                label='Adjustive Instrument: ArthroStim'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Adjustive Instrument: Impulse adjusting instrument'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Adjustive Instrument: Impulse adjusting instrument'
                                control={
                                  <Checkbox name='Adjustive Instrument: Impulse adjusting instrument' />
                                }
                                label='Adjustive Instrument: Impulse adjusting instrument'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Gonstead'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Gonstead'
                                control={<Checkbox name='Gonstead' />}
                                label='Gonstead'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Cox flexion/distraction'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Cox flexion/distraction'
                                control={
                                  <Checkbox name='Cox flexion/distraction' />
                                }
                                label='Cox flexion/distraction'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Thompson'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Thompson'
                                control={<Checkbox name='Thompson' />}
                                label='Thompson'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Sacro-Occipital Technique (SOT)'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Sacro-Occipital Technique (SOT)'
                                control={
                                  <Checkbox name='Sacro-Occipital Technique (SOT)' />
                                }
                                label='Sacro-Occipital Technique (SOT)'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'HIO / Atlas Orthogonal'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='HIO / Atlas Orthogonal'
                                control={
                                  <Checkbox name='HIO / Atlas Orthogonal' />
                                }
                                label='HIO / Atlas Orthogonal'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Nimmo-Tonus'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Nimmo-Tonus'
                                control={<Checkbox name='Nimmo-Tonus' />}
                                label='Nimmo-Tonus'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Logan Basic'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Logan Basic'
                                control={<Checkbox name='Logan Basic' />}
                                label='Logan Basic'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Meric'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Meric'
                                control={<Checkbox name='Meric' />}
                                label='Meric'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={manipulativeTechniques.includes(
                                  'Pierce-Stillwagon'
                                )}
                                onChange={handleManipulativeTechniquesChange}
                                name='Pierce-Stillwagon'
                                control={<Checkbox name='Pierce-Stillwagon' />}
                                label='Pierce-Stillwagon'
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
                          Non adjustive techniques & procedures
                        </FormLabel>
                        <FormGroup>
                          <GridContainer>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Mobilization/ Manual traction'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Mobilization/ Manual traction'
                                control={
                                  <Checkbox name='Mobilization/ Manual traction' />
                                }
                                label='Mobilization/ Manual traction'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Soft-tissue therapy: Graston'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Soft-tissue therapy: Graston'
                                control={
                                  <Checkbox name='Soft-tissue therapy: Graston' />
                                }
                                label='Soft-tissue therapy: Graston'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Soft-tissue therapy: ART / myofascial release'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Soft-tissue therapy: ART / myofascial release'
                                control={
                                  <Checkbox name='Soft-tissue therapy: ART / myofascial release' />
                                }
                                label='Soft-tissue therapy: ART / myofascial release'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Soft-tissue therapy: Ischemic compression / trigger point therapy'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Soft-tissue therapy: Ischemic compression / trigger point therapy'
                                control={
                                  <Checkbox name='Soft-tissue therapy: Ischemic compression / trigger point therapy' />
                                }
                                label='Soft-tissue therapy: Ischemic compression / trigger point therapy'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Soft-tissue therapy: Massage therapy'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Soft-tissue therapy: Massage therapy'
                                control={
                                  <Checkbox name='Soft-tissue therapy: Massage therapy' />
                                }
                                label='Soft-tissue therapy: Massage therapy'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Motorized  traction / spinal decompression'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Motorized  traction / spinal decompression'
                                control={
                                  <Checkbox name='Motorized  traction / spinal decompression' />
                                }
                                label='Motorized  traction / spinal decompression'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Formal patient education'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Formal patient education'
                                control={
                                  <Checkbox name='Formal patient education' />
                                }
                                label='Formal patient education'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Ergonomic instructions'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Ergonomic instructions'
                                control={
                                  <Checkbox name='Ergonomic instructions' />
                                }
                                label='Ergonomic instructions'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Nutritional counseling'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Nutritional counseling'
                                control={
                                  <Checkbox name='Nutritional counseling' />
                                }
                                label='Nutritional counseling'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Exercise instruction / prescription'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Exercise instruction / prescription'
                                control={
                                  <Checkbox name='Exercise instruction / prescription' />
                                }
                                label='Exercise instruction / prescription'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Cold / ice'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Cold / ice'
                                control={<Checkbox name='Cold / ice' />}
                                label='Cold / ice'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Heat'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Heat'
                                control={<Checkbox name='Heat' />}
                                label='Heat'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Orthotics/ lifts'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Orthotics/ lifts'
                                control={<Checkbox name='Orthotics/ lifts' />}
                                label='Orthotics/ lifts'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Orthopedic supports / Brace'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Orthopedic supports / Brace'
                                control={
                                  <Checkbox name='Orthopedic supports / Brace' />
                                }
                                label='Orthopedic supports / Brace'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Casting/ Taping'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Casting/ Taping'
                                control={<Checkbox name='Casting/ Taping' />}
                                label='Casting/ Taping'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Electrical stimulation'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Electrical stimulation'
                                control={
                                  <Checkbox name='Electrical stimulation' />
                                }
                                label='Electrical stimulation'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Interferential current'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Interferential current'
                                control={
                                  <Checkbox name='Interferential current' />
                                }
                                label='Interferential current'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Direct Current'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Direct Current'
                                control={<Checkbox name='Direct Current' />}
                                label='Direct Current'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Diathermy'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Diathermy'
                                control={<Checkbox name='Diathermy' />}
                                label='Diathermy'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Ultrasound'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Ultrasound'
                                control={<Checkbox name='Ultrasound' />}
                                label='Ultrasound'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Acupuncture'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Acupuncture'
                                control={<Checkbox name='Acupuncture' />}
                                label='Acupuncture'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Dry needling'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Dry needling'
                                control={<Checkbox name='Dry needling' />}
                                label='Dry needling'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Shockwave'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Shockwave'
                                control={<Checkbox name='Shockwave' />}
                                label='Shockwave'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Cold laser'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Cold laser'
                                control={<Checkbox name='Cold laser' />}
                                label='Cold laser'
                              />
                            </GridItem>
                            <GridItem xs={12} lg={6}>
                              <FormControlLabel
                                checked={nonAdjustiveTechniques.includes(
                                  'Other'
                                )}
                                onChange={handleNonAdjustiveTechniquesChange}
                                name='Other'
                                control={<Checkbox name='Other' />}
                                label='Other'
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

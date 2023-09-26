import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Box,
  FormControlLabel,
  FormHelperText,
  Switch,
} from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { invitePatient } from '../../actions/professional';
import { setAlert } from '../../actions/alert';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';
import Consent from '../auth/Consent';
import { URI } from '../../actions/auth';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useStyles = makeStyles(styles);
const useInputStyles = makeStyles(inputStyles);

function Invite({ invitePatient }) {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: ({ email }) => {
      invitePatient(email);
    },
  });

  const [consentData, setConsentData] = useState({});

  const formikRegister = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      language: '',
      gender: '',
      genderOther: '',
      dob: null,
      email: '',
      password: 'gsci2023',
      password2: 'gsci2023',
    },
    onSubmit: async ({
      firstName,
      lastName,
      language,
      gender,
      genderOther,
      dob,
      email,
      password,
      password2,
      terms,
    }) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify({
        name: `${firstName} ${lastName}`,
        language,
        gender: gender === 'Other' ? genderOther : gender,
        dob,
        email,
        password,
        research: consentData.dataConsent && consentData.participantConsent,
        dataConsent: consentData.dataConsent,
        participantConsent: consentData.participantConsent,
        terms: true,
      });

      try {
        await axios.post(`${URI}/api/professionals/register`, body, config);
        alert('Patient registered successfully!');
        formikRegister.resetForm();
      } catch (error) {
        const errors = error.response.data.errors;

        if (errors) {
          errors.forEach((error) => alert(error.msg));
        }
      }
    },
  });

  return (
    <>
      <GridContainer justifyContent="center">
        <GridItem xs={12} lg={10} xl={8}>
          <Alert />
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>
                {t('register.fromInviteTitle')}
              </h4>
            </CardHeader>
            <form onSubmit={formikRegister.handleSubmit}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="firstName"
                      >
                        {t('register.firstName')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="text"
                        id={'firstName'}
                        value={formikRegister.values.firstName}
                        onChange={formikRegister.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="lastName"
                      >
                        {t('register.lastName')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="text"
                        id={'lastName'}
                        value={formikRegister.values.lastName}
                        onChange={formikRegister.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="language"
                      >
                        {t('register.language')}
                      </InputLabel>

                      <NativeSelect
                        value={formikRegister.values.language}
                        onChange={formikRegister.handleChange}
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
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="gender"
                      >
                        {t('register.gender')}
                      </InputLabel>

                      <NativeSelect
                        value={formikRegister.values.gender}
                        onChange={formikRegister.handleChange}
                        inputProps={{
                          id: 'gender',
                        }}
                      >
                        <option value="" defaultValue disabled></option>
                        <option value="Male">{t('register.male')}</option>
                        <option value="Female">{t('register.female')}</option>
                        <option value="Other">{t('register.other')}</option>
                      </NativeSelect>
                    </FormControl>
                  </GridItem>
                  {formikRegister.values.gender === 'Other' && (
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor="genderOther"
                        >
                          {t('register.genderOther')}
                        </InputLabel>

                        <Input
                          classes={{
                            disabled: inputClasses.disabled,
                            underline: classNames(
                              inputClasses.underlineError,
                              inputClasses.underline
                            ),
                          }}
                          type="text"
                          id={'genderOther'}
                          value={formikRegister.values.genderOther}
                          onChange={formikRegister.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                  )}
                  <GridItem xs={12} lg={6}>
                    <Box className={inputClasses.formControl}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          format="MM/dd/yyyy"
                          id="dob"
                          variant="inline"
                          label={t('register.dob')}
                          value={formikRegister.values.dob}
                          onChange={(value) =>
                            formikRegister.setFieldValue('dob', value)
                          }
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Box>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="email"
                      >
                        {t('register.email')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="text"
                        id={'email'}
                        value={formikRegister.values.email}
                        onChange={formikRegister.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="password"
                      >
                        {t('register.password')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="password"
                        id={'password'}
                        value={formikRegister.values.password}
                        onChange={formikRegister.handleChange}
                      />
                      <FormHelperText>
                        {t('register.passwordRequirements')}
                      </FormHelperText>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} lg={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="password2"
                      >
                        {t('register.passwordConfirmation')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="password"
                        id={'password2'}
                        value={formikRegister.values.password2}
                        onChange={formikRegister.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <Consent
                      setConsentData={setConsentData}
                      consentData={consentData}
                    />
                  </GridItem>
                  <GridItem xs={12}>
                    <FormControlLabel
                      className={inputClasses.formControl}
                      control={
                        <Switch
                          checked={formikRegister.values.terms}
                          onChange={formikRegister.handleChange}
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
              </CardBody>
              <CardFooter>
                <GridItem xs={12}>
                  <Button color="danger" type="submit">
                    {t('register.submit')}
                  </Button>
                </GridItem>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
        <GridItem xs={12} lg={10} xl={8}>
          <Alert />
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>
                {t('professional.invite.title')}
              </h4>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor="email"
                      >
                        {t('guest.login.email')}
                      </InputLabel>

                      <Input
                        classes={{
                          disabled: inputClasses.disabled,
                          underline: classNames(
                            inputClasses.underlineError,
                            inputClasses.underline
                          ),
                        }}
                        type="text"
                        id={'email'}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="success" type="submit">
                  {t('professional.invite.submit')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
}

Invite.propTypes = {
  invitePatient: PropTypes.func.isRequired,
};

export default connect(null, {
  invitePatient,
  setAlert,
})(Invite);

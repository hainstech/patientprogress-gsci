import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Box,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import classNames from 'classnames';
import { useFormik } from 'formik';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useStyles = makeStyles(styles);
const useInputStyles = makeStyles(inputStyles);

const Register = ({ setAlert, register, isAuthenticated, type, match }) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      language: '',
      gender: '',
      dob: null,
      email: '',
      password: '',
      password2: '',
      research: false,
    },
    onSubmit: ({
      firstName,
      lastName,
      language,
      gender,
      dob,
      email,
      password,
      password2,
      research,
    }) => {
      if (password !== password2) {
        setAlert(t('register.passwordError'), 'danger');
      } else {
        register({
          name: `${firstName} ${lastName}`,
          language,
          gender,
          dob,
          email,
          password,
          research,
          professional: match.params.id,
        });
      }
    },
  });

  if (isAuthenticated && type) {
    switch (type) {
      case 'patient':
        return <Redirect to={`/patient/questionnaires`} />;
      case 'professional':
        return <Redirect to={`/professional/patients`} />;
      default:
        return <Redirect to={`/${type}/dashboard`} />;
    }
  }

  return (
    <>
      <GridContainer justify='center'>
        <GridItem xs={12} lg={6}>
          <Alert />
          <Card>
            <CardHeader color='danger'>
              <h4 className={classes.cardTitleWhite}>{t('register.title')}</h4>
            </CardHeader>
            <form onSubmit={formik.handleSubmit}>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='firstName'
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
                        type='text'
                        id={'firstName'}
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='lastName'
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
                        type='text'
                        id={'lastName'}
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='language'
                      >
                        {t('register.language')}
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
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='gender'
                      >
                        {t('register.gender')}
                      </InputLabel>

                      <NativeSelect
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        inputProps={{
                          id: 'gender',
                        }}
                      >
                        <option value='' defaultValue disabled></option>
                        <option value='Male'>Homme/Male</option>
                        <option value='Female'>Femme/Female</option>
                      </NativeSelect>
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <Box className={inputClasses.formControl}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          format='MM/dd/yyyy'
                          id='dob'
                          variant='inline'
                          label={t('register.dob')}
                          value={formik.values.dob}
                          onChange={(value) =>
                            formik.setFieldValue('dob', value)
                          }
                          KeyboardButtonProps={{
                            'aria-label': 'change date',
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Box>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='email'
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
                        type='text'
                        id={'email'}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='password'
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
                        type='password'
                        id={'password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControl fullWidth className={inputClasses.formControl}>
                      <InputLabel
                        className={inputClasses.labelRoot}
                        htmlFor='password2'
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
                        type='password'
                        id={'password2'}
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} xl={6}>
                    <FormControlLabel
                      className={inputClasses.formControl}
                      control={
                        <Switch
                          checked={formik.values.research}
                          onChange={formik.handleChange}
                          name='research'
                        />
                      }
                      label={t('register.consent')}
                    />
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color='danger' type='submit'>
                  {t('register.submit')}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { setAlert, register })(Register);

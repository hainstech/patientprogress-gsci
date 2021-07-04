import React from 'react';
import { Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, Input, Box } from '@material-ui/core';
import classNames from 'classnames';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';

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

const Login = ({ login, isAuthenticated, type, history }) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const recaptchaRef = React.createRef();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ email, password }) => {
      login(email.toLowerCase(), password, recaptchaRef, history);
    },
  });

  // Redirect if logged in
  if (isAuthenticated && type) {
    switch (type) {
      case 'patient':
        return <Redirect to={`/patient/questionnaires`} />;
      case 'professional':
        return <Redirect to={`/professional/patients`} />;
      case 'admin':
        return <Redirect to={`/admin/questionnaire-builder`} />;
      default:
        return <Redirect to={`/${type}/dashboard`} />;
    }
  }

  return (
    <GridContainer justify='center'>
      <GridItem xs={12} md={6}>
        <Alert />
        <Card>
          <CardHeader color='danger'>
            <h4 className={classes.cardTitleWhite}>{t('guest.login.title')}</h4>
          </CardHeader>
          <form onSubmit={formik.handleSubmit}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor='email'
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
                      type='text'
                      id={'email'}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth className={inputClasses.formControl}>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor='password'
                    >
                      {t('guest.login.password')}
                    </InputLabel>

                    <Input
                      classes={{
                        disabled: inputClasses.disabled,
                        underline: classNames(
                          inputClasses.underlineError,
                          inputClasses.underline
                        ),
                      }}
                      autoComplete='true'
                      type='password'
                      id={'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <Box mt={3}>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey='6LcFZ0EbAAAAAO3o623ERVuLe5mb17Oj_UT9LNG4'
                    />
                  </Box>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color='success' type='submit'>
                {t('guest.login.submit')}
              </Button>
              <Link to='/forgot'>{t('forgot.link')}</Link>
            </CardFooter>
          </form>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { login })(withRouter(Login));

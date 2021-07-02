import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { sendForgotEmail } from '../../actions/auth';
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

const Forgot = ({ sendForgotEmail, isAuthenticated, type }) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const recaptchaRef = React.createRef();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: ({ email }) => {
      const recaptchaValue = recaptchaRef.current.getValue();
      sendForgotEmail(email.toLowerCase(), recaptchaValue);
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
            <h4 className={classes.cardTitleWhite}>{t('forgot.reset')}</h4>
            <p className={classes.cardCategoryWhite}>
              {t('forgot.directions')}
            </p>
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
                {t('register.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

Forgot.propTypes = {
  sendForgotEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { sendForgotEmail })(Forgot);

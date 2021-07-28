import React from 'react';
import { Redirect } from 'react-router';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setNewPassword } from '../../actions/auth';
import { setAlert } from '../../actions/alert';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  Input,
  Box,
  FormHelperText,
} from '@material-ui/core';
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

const NewPassword = ({
  setNewPassword,
  isAuthenticated,
  type,
  match,
  history,
  setAlert,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const recaptchaRef = React.createRef();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      password: '',
      password2: '',
    },
    onSubmit: ({ password, password2 }) => {
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password
        )
      ) {
        setAlert(
          `${t('register.invalidPassword')}: ${t(
            'register.passwordRequirements'
          )}`,
          'danger'
        );
        recaptchaRef.current.reset();
      } else if (password !== password2) {
        setAlert(t('register.passwordError'), 'danger');
        recaptchaRef.current.reset();
      } else {
        const recaptchaValue = recaptchaRef.current.getValue();
        setNewPassword(
          password,
          match.params.id,
          match.params.token,
          recaptchaValue,
          history
        );
      }
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
    <GridContainer justifyContent='center'>
      <GridItem xs={12} md={6}>
        <Alert />
        <Card>
          <CardHeader color='danger'>
            <h4 className={classes.cardTitleWhite}>
              {t('forgot.newPassword')}
            </h4>
          </CardHeader>
          <form onSubmit={formik.handleSubmit}>
            <CardBody>
              <GridContainer>
                <GridItem xs={12}>
                  <FormControl fullWidth>
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
                      autoComplete='new-password'
                      type='password'
                      id={'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                    <FormHelperText>
                      {t('register.passwordRequirements')}
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
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
                      autoComplete='new-password'
                      type='password'
                      id={'password2'}
                      value={formik.values.password2}
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

NewPassword.propTypes = {
  setNewPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  type: PropTypes.string,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  type: state.auth.type,
});

export default connect(mapStateToProps, { setNewPassword, setAlert })(
  withRouter(NewPassword)
);

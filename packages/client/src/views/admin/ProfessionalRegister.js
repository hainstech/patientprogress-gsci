import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import classNames from 'classnames';
import { useFormik } from 'formik';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import CardFooter from '../../components/Card/CardFooter.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';
import * as axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useStyles = makeStyles(styles);
const useInputStyles = makeStyles(inputStyles);

const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
const URI =
  process.env.NODE_ENV === 'production'
    ? `https://${prefix}api.patientprogress.ca`
    : '';

const ProfessionalRegister = () => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      name: '',
      clinic: '',
      gender: '',
      yearOfBirth: '',
      description: 'professional',
      language: 'en',
      phone: '',
      profession: 'chiropractor',
      type: 'professional',
    },
    onSubmit: (data) => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(data);

      axios
        .post(`${URI}/api/users/admin`, body, config)
        .then((res) => {
          alert('Professional Registered');
        })
        .catch((err) => {
          alert(JSON.stringify(err.response.data));
        });
    },
  });

  return (
    <GridContainer justifyContent="center">
      <GridItem xs={12} md={6}>
        <Alert />
        <Card>
          <CardHeader color="danger">
            <h4 className={classes.cardTitleWhite}>
              {t('sidebar.professional-register')}
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
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="password"
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
                      type="text"
                      id={'password'}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="name"
                    >
                      {t('professional.preferences.name')}
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
                      id={'name'}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="clinic"
                    >
                      {t('professional.preferences.clinic')}
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
                      id={'clinic'}
                      value={formik.values.clinic}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="gender"
                    >
                      {t('professional.patient.gender')} (Male/Female)
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
                      id={'gender'}
                      value={formik.values.gender}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="yearOfBirth"
                    >
                      {t('professional.preferences.yearOfBirth')}
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
                      id={'yearOfBirth'}
                      value={formik.values.yearOfBirth}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="language"
                    >
                      {t('professional.preferences.language')} (en/fr)
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
                      id={'language'}
                      value={formik.values.language}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>

                <GridItem xs={12}>
                  <FormControl fullWidth>
                    <InputLabel
                      className={inputClasses.labelRoot}
                      htmlFor="phone"
                    >
                      {t('professional.preferences.phone')} (8191234567)
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
                      id={'phone'}
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="success" type="submit">
                {t('register.submit')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </GridItem>
    </GridContainer>
  );
};

export default ProfessionalRegister;

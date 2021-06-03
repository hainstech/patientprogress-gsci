import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import classNames from 'classnames';
import { useFormik } from 'formik';

import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
} from '@material-ui/core';

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

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import inputStyles from '../../assets/jss/material-dashboard-react/components/customInputStyle.js';
const useStyles = makeStyles(styles);
const useInputStyles = makeStyles(inputStyles);

const Preferences = ({
  profile: { profile, loading },
  editProfile,
  getCurrentProfile,
  history,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();
  const { t } = useTranslation();

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
    }
    // eslint-disable-next-line
  }, [loading, getCurrentProfile, profile]);

  const formik = useFormik({
    initialValues: {
      name: '',
      clinic: '',
      description: '',
      phone: '',
      language: '',
    },
    onSubmit: async (data) => {
      await editProfile('professional', data, history);
      await getCurrentProfile('professional');
    },
  });

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12} lg={6}>
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
                  <GridContainer>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor='name'
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
                          type='text'
                          id={'name'}
                          value={formik.values.name}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor='clinic'
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
                          type='text'
                          id={'clinic'}
                          value={formik.values.clinic}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor='phone'
                        >
                          {t('professional.preferences.phone')}
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
                          id={'phone'}
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
                      <FormControl
                        fullWidth
                        className={inputClasses.formControl}
                      >
                        <InputLabel
                          className={inputClasses.labelRoot}
                          htmlFor='description'
                        >
                          {t('professional.preferences.yourDescription')}
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
                          id={'description'}
                          value={formik.values.description}
                          onChange={formik.handleChange}
                          // multiline
                          // rows='5'
                        />
                      </FormControl>
                    </GridItem>
                    <GridItem xs={12}>
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

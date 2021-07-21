import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useFormik } from 'formik';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import {
  FormControl,
  InputLabel,
  Input,
  NativeSelect,
  Box,
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

const EditProfile = ({
  profile: { profile, loading },
  editProfile,
  getCurrentProfile,
  history,
}) => {
  const classes = useStyles();
  const inputClasses = useInputStyles();

  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      name: '',
      language: '',
      dob: null,
    },
    onSubmit: async (data) => {
      await editProfile('patient', data, history);
      await getCurrentProfile('patient');
    },
  });

  useEffect(() => {
    if (!profile) getCurrentProfile('patient');
    if (!loading && profile) {
      formik.setFieldValue('name', !profile.name ? '' : profile.name);
      formik.setFieldValue(
        'language',
        !profile.language ? '' : profile.language
      );
      formik.setFieldValue('dob', !profile.dob ? '' : profile.dob);
    }
    // eslint-disable-next-line
  }, [loading, getCurrentProfile, profile]);

  return (
    <Fragment>
      {profile === null ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent='center'>
          <GridItem xs={12} lg={6}>
            <Alert />
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {t('patient.profile.title')}
                </h4>
                <p className={classes.cardCategoryWhite}>
                  {t('patient.profile.description')}
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
                          {t('patient.profile.name')}
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
                          htmlFor='language'
                        >
                          {t('patient.profile.language')}
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
                    <GridItem xs={12}>
                      <Box className={inputClasses.formControl}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <KeyboardDatePicker
                            format='yyyy-MM-dd'
                            id='dob'
                            variant='inline'
                            label={t('patient.profile.dob')}
                            value={formik.values.dob}
                            onChange={(value) => {
                              formik.setFieldValue('dob', value);
                            }}
                            KeyboardButtonProps={{
                              'aria-label': 'change date',
                            }}
                          />
                        </MuiPickersUtilsProvider>
                      </Box>
                    </GridItem>
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button color='success' type='submit'>
                    {t('patient.profile.submit')}
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

EditProfile.propTypes = {
  editProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { editProfile, getCurrentProfile })(
  withRouter(EditProfile)
);

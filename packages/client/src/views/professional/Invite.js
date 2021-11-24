import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, Input } from '@material-ui/core';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { invitePatient } from '../../actions/professional';

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

  return (
    <>
      <GridContainer justifyContent="center">
        <GridItem xs={12} md={6}>
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
})(Invite);

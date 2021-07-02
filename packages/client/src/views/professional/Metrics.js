import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import Alert from '../layout/Alert';
import { setAlert } from '../../actions/alert';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
const useStyles = makeStyles(styles);

const getAllPatients = async () => {
  const URI =
    process.env.NODE_ENV === 'production'
      ? 'https://api.patientprogress.ca'
      : '';
  try {
    const res = await axios.get(`${URI}/api/patients/all`);

    return res.data;
  } catch (err) {
    setAlert('Error', 'danger');
  }
};

const Metrics = () => {
  const classes = useStyles();

  const [allPatients, setAllPatients] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const patients = await getAllPatients();
      setAllPatients(patients);
    })();
  }, []);
  return (
    <>
      {!allPatients ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <Alert />
          <Card>
            <CardHeader color='danger'>
              <h4 className={classes.cardTitleWhite}>
                Metrics about your practice
              </h4>
              <p className={classes.cardCategoryWhite}>
                Different metrics about your practice. This is a Beta feature
                and is in constant evolution.
              </p>
            </CardHeader>

            <CardBody>
              <GridContainer>
                <GridItem xs={6}>
                  {/* Diagramme a bandes: tranches d'age */}
                </GridItem>
                <GridItem xs={6}>{/* Diagram en beigne: gender */}</GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridContainer>
      )}
    </>
  );
};

export default Metrics;

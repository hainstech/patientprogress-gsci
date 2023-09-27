import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Bar, Doughnut } from 'react-chartjs-2';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import TableChartIcon from '@material-ui/icons/TableChart';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Alert from '../layout/Alert';
import { setAlert } from '../../actions/alert';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
const useStyles = makeStyles(styles);

const getAllPatients = async () => {
  const prefix = process.env.REACT_APP_BETA ? 'beta.' : '';
  const URI =
    process.env.NODE_ENV === 'production'
      ? `https://${prefix}patientprogress-server-wqqoimymxa-ue.a.run.app`
      : '';
  try {
    const res = await axios.get(`${URI}/api/patients/all`);

    return res.data;
  } catch (err) {
    setAlert('Error', 'danger');
  }
};

const parseAge = (dobs) => {
  let data = [0, 0, 0, 0, 0, 0, 0, 0];
  const ages = dobs.map((dob) =>
    Math.floor((new Date() - new Date(dob).getTime()) / 3.15576e10)
  );
  ages.forEach((age) => {
    if (age < 1) data[0]++;
    if (age >= 1 && age <= 5) data[1]++;
    if (age >= 5 && age <= 14) data[2]++;
    if (age >= 15 && age <= 24) data[3]++;
    if (age >= 25 && age <= 44) data[4]++;
    if (age >= 45 && age <= 64) data[5]++;
    if (age >= 65 && age <= 74) data[6]++;
    if (age >= 75) data[7]++;
  });
  return data;
};

const parseGender = (genders) => {
  let data = [0, 0, 0];
  genders.forEach((gender) => {
    switch (gender) {
      case 'Male':
        data[0]++;
        break;
      case 'Female':
        data[1]++;
        break;
      default:
        data[2]++;
        break;
    }
  });
  return data;
};

const Metrics = () => {
  const classes = useStyles();

  useEffect(() => {
    (async () => {
      const patients = await getAllPatients();
      setAllPatients(patients);
    })();
  }, []);

  const [allPatients, setAllPatients] = useState(null);

  const { t } = useTranslation();

  const [visuals, setVisuals] = useState(['charts']);

  const handleVisuals = (event, newVisuals) => {
    if (newVisuals.length === 0) return;
    setVisuals(newVisuals);
  };

  const displayCharts = () => {
    return visuals.includes('charts');
  };

  const displayTables = () => {
    return visuals.includes('tables');
  };

  return (
    <>
      {!allPatients ? (
        <Spinner />
      ) : (
        <GridContainer justifyContent="center">
          <Alert />
          <Card>
            <CardHeader color="danger">
              <h4 className={classes.cardTitleWhite}>{t('metrics.title')}</h4>
              <p className={classes.cardCategoryWhite}>
                {t('metrics.description')}
              </p>
            </CardHeader>

            <CardBody>
              <GridContainer>
                <GridItem xs={12}>
                  <ToggleButtonGroup
                    value={visuals}
                    onChange={handleVisuals}
                    aria-label="visuals"
                  >
                    <ToggleButton value="charts" aria-label="charts">
                      <EqualizerIcon />
                    </ToggleButton>
                    <ToggleButton value="tables" aria-label="tables">
                      <TableChartIcon />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </GridItem>
                <GridItem xs={12} lg={6}>
                  <GridContainer>
                    {displayCharts() && (
                      <GridItem xs={12}>
                        {/* Diagramme a bandes: tranches d'age */}
                        <Box mt={2}>
                          <Bar
                            height={400}
                            width={400}
                            data={{
                              labels: [
                                '<1',
                                '1-4',
                                '5-14',
                                '15-24',
                                '25-44',
                                '45-64',
                                '65-74',
                                '≥75',
                              ],
                              datasets: [
                                {
                                  label: 'Number of patients',
                                  data: parseAge(
                                    allPatients.map((patient) => patient.dob)
                                  ),
                                  backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(34, 139, 34, 0.2)',
                                    'rgba(210, 105, 30, 0.2)',
                                  ],
                                  borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(34, 139, 34, 1)',
                                    'rgba(210, 105, 30, 1)',
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              responsive: true,
                              scales: {
                                yAxes: [
                                  {
                                    ticks: {
                                      beginAtZero: true,
                                    },
                                  },
                                ],
                              },
                              plugins: {
                                title: {
                                  display: true,
                                  text: `${t('metrics.ageTitle')} (n=${
                                    allPatients.length
                                  })`,
                                },
                                legend: {
                                  display: false,
                                },
                              },
                            }}
                          />
                        </Box>
                      </GridItem>
                    )}

                    {displayTables() && (
                      <GridItem xs={12}>
                        <Box mt={2}>
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    {t('metrics.ageTableTitle')}
                                  </TableCell>
                                  <TableCell align="right">
                                    n={allPatients.length}
                                  </TableCell>
                                  <TableCell align="right">%</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {parseAge(
                                  allPatients.map((patient) => patient.dob)
                                ).map((ageAmount, i) => {
                                  const categories = [
                                    '<1',
                                    '1-4',
                                    '5-14',
                                    '15-24',
                                    '25-44',
                                    '45-64',
                                    '65-74',
                                    '≥75',
                                  ];

                                  return (
                                    <TableRow key={i}>
                                      <TableCell component="th" scope="row">
                                        {categories[i]}
                                      </TableCell>
                                      <TableCell align="right">
                                        {ageAmount}
                                      </TableCell>
                                      <TableCell align="right">
                                        {Math.round(
                                          (ageAmount / allPatients.length) *
                                            10000
                                        ) / 100}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </GridItem>
                    )}
                  </GridContainer>
                </GridItem>
                <GridItem xs={12} lg={6}>
                  <GridContainer>
                    {displayCharts() && (
                      <GridItem xs={12}>
                        {/* Diagram en beigne: gender */}
                        <Box mt={2}>
                          <Doughnut
                            height={400}
                            width={400}
                            data={{
                              labels: ['Male', 'Female', 'Other'],
                              datasets: [
                                {
                                  label: '# of Votes',
                                  data: parseGender(
                                    allPatients.map((patient) => patient.gender)
                                  ),
                                  backgroundColor: [
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',

                                    'rgba(255, 206, 86, 0.2)',
                                  ],
                                  borderColor: [
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(255, 206, 86, 1)',
                                  ],
                                  borderWidth: 1,
                                },
                              ],
                            }}
                            options={{
                              maintainAspectRatio: false,
                              plugins: {
                                title: {
                                  display: true,
                                  text: `${t('metrics.genderTitle')} (n=${
                                    allPatients.length
                                  })`,
                                },
                              },
                            }}
                          />
                        </Box>
                      </GridItem>
                    )}
                    {displayTables() && (
                      <GridItem xs={12}>
                        <Box mt={2}>
                          <TableContainer component={Paper}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    {t('professional.patient.gender')}
                                  </TableCell>
                                  <TableCell align="right">
                                    n={allPatients.length}
                                  </TableCell>
                                  <TableCell align="right">%</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {parseGender(
                                  allPatients.map((patient) => patient.gender)
                                ).map((gendersAmount, i) => {
                                  const categories = [
                                    'Male',
                                    'Female',
                                    'Other',
                                  ];

                                  return (
                                    <TableRow key={i}>
                                      <TableCell component="th" scope="row">
                                        {categories[i]}
                                      </TableCell>
                                      <TableCell align="right">
                                        {gendersAmount}
                                      </TableCell>
                                      <TableCell align="right">
                                        {Math.round(
                                          (gendersAmount / allPatients.length) *
                                            10000
                                        ) / 100}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Box>
                      </GridItem>
                    )}
                  </GridContainer>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridContainer>
      )}
    </>
  );
};

export default Metrics;

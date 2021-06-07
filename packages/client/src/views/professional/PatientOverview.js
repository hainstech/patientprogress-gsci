import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import DayJS from 'react-dayjs';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import dayjs from 'dayjs';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { getPatient } from '../../actions/professional';

const useStyles = makeStyles(styles);

const PatientOverview = ({
  professional: { patient, loading },
  match,
  getPatient,
}) => {
  const classes = useStyles();

  useEffect(() => {
    getPatient(match.params.id);
  }, [getPatient, match.params.id]);

  const { t } = useTranslation();

  const renderButton = (params) => {
    return (
      <Link
        to={`/professional/patients/${match.params.id}/questionnaires/${params.row.id}`}
      >
        <Button color='success'>{t('professional.search.open')}</Button>
      </Link>
    );
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Answers',
      sortable: false,
      width: 110,
      disableClickEventBubbling: true,
      renderCell: renderButton,
    },
    { field: 'title', headerName: 'Questionnaire', width: 200 },
    {
      field: 'time',
      headerName: 'Date',
      width: 110,
    },
  ];

  return (
    <>
      {patient === null || loading ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12} lg={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>Patient Details</h4>
              </CardHeader>
              <CardBody>
                <GridContainer justify='center'>
                  <GridItem xs={12} xl={4}>
                    Name: {patient.name}
                  </GridItem>

                  <GridItem xs={12} xl={4}>
                    Date of Birth:{' '}
                    <DayJS format='YYYY/MM/DD'>{patient.dob}</DayJS>
                  </GridItem>

                  <GridItem xs={12} xl={4}>
                    Gender: {patient.gender}
                  </GridItem>
                </GridContainer>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={12} lg={6}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  Filled Questionnaires
                </h4>
              </CardHeader>
              <CardBody>
                {patient.questionnaires.length > 0 ? (
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={patient.questionnaires
                        .map(({ title, time, _id }) => {
                          return {
                            id: _id,
                            title,
                            time: dayjs(time).format('YYYY/MM/DD'),
                          };
                        })
                        .reverse()}
                      columns={columns}
                      pageSize={5}
                    />
                  </div>
                ) : (
                  <p style={{ textAlign: 'center' }}>None</p>
                )}
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
};

PatientOverview.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
})(PatientOverview);

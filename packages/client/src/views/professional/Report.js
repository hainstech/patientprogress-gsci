import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { withRouter } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';

import Spinner from '../../components/Spinner/Spinner';

import GridContainer from '../../components/Grid/GridContainer';
import GridItem from '../../components/Grid/GridItem.js';
import Card from '../../components/Card/Card.js';
import CardHeader from '../../components/Card/CardHeader.js';
import CardBody from '../../components/Card/CardBody.js';
import Button from '../../components/CustomButtons/Button.js';
import CardFooter from '../../components/Card/CardFooter.js';

import { makeStyles } from '@material-ui/core/styles';
import styles from '../../assets/jss/material-dashboard-react/views/dashboardStyle';
import { getPatient } from '../../actions/professional';

const useStyles = makeStyles(styles);

const Report = ({
  professional: { patient, loading },
  match,
  getPatient,
  history,
}) => {
  const classes = useStyles();

  const { t } = useTranslation();

  const [report, setReport] = useState({});

  useEffect(() => {
    if (!patient || patient._id !== match.params.id) {
      getPatient(match.params.id).then((patient) => {
        setReport(
          patient.reports.find(
            (report) => report._id === match.params.report_id
          )
        );
      });
    } else {
      setReport(
        patient.reports.find((report) => report._id === match.params.report_id)
      );
    }
  }, [getPatient, match.params.id, match.params.report_id, patient]);

  return (
    <>
      {patient === null || !report.date || loading ? (
        <Spinner />
      ) : (
        <GridContainer justify='center'>
          <GridItem xs={12}>
            <Card>
              <CardHeader color='danger'>
                <h4 className={classes.cardTitleWhite}>
                  {`Report - ${patient.name} - ${format(
                    zonedTimeToUtc(parseISO(report.date)),
                    'yyyy/MM/dd'
                  )}`}
                </h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        Patient's Name: {patient.name}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('professional.patient.gender')}:{' '}
                        {patient.gender === 'Male' ||
                        patient.gender === 'Female'
                          ? t(`professional.patient.${patient.gender}`)
                          : patient.gender}
                      </GridItem>
                      <GridItem xs={12}>Age: {report.age}</GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        Date:{' '}
                        {format(
                          zonedTimeToUtc(parseISO(report.date)),
                          'yyyy/MM/dd'
                        )}
                      </GridItem>
                      <GridItem xs={12}>
                        Professional's Name: {report.professionalName}
                      </GridItem>
                      <GridItem xs={12}>
                        {/* #TODO Translate the profession */}
                        Profession: {report.professionalProfession}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Civil status: {report.civilStatus}
                      </GridItem>
                      <GridItem xs={12}>
                        Number of children: {report.nbChildrens}
                      </GridItem>
                      <GridItem xs={12}>
                        Occupation: {report.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        Employment status: {report.employmentStatus}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Chief complaint: {report.chiefComplaint}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint region: {report.chiefComplaintRegion}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint start: {report.chiefComplaintStart}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint appearance:{' '}
                        {report.chiefComplaintAppear}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint description:{' '}
                        {report.chiefComplaintAppearDescription}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint evolving:{' '}
                        {report.chiefComplaintEvolving}
                      </GridItem>
                      <GridItem xs={12}>
                        Chief complaint reccurence:{' '}
                        {report.chiefComplaintRecurrence}
                      </GridItem>

                      {report.otherComplaints && (
                        <GridItem xs={12}>
                          Other complaints: {report.otherComplaints}
                        </GridItem>
                      )}

                      <GridItem xs={12}>
                        <br />
                        Occupation: {report.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        Employment status: {report.employmentStatus}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {report.comorbidities.length === 0 &&
                          'No commorbidities'}
                        {report.comorbidities.length > 0 &&
                          report.comorbidities.map((comorbidity, i) => (
                            <GridContainer key={`${i}-${comorbidity.name}1`}>
                              <GridItem
                                key={`${i}-${comorbidity.name}`}
                                xs={12}
                              >
                                Comorbidity: {comorbidity.name}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.treatment}`}
                                xs={12}
                              >
                                Is receiving treatment: {comorbidity.treatment}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.activityLimitation}`}
                                xs={12}
                              >
                                Activity limitaion:{' '}
                                {comorbidity.activityLimitation}
                              </GridItem>
                            </GridContainer>
                          ))}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        Red flags:{' '}
                        {report.redFlags.toString()
                          ? report.redFlags.toString()
                          : 'None'}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Relevant scores:{' '}
                        {report.relevantScore.length === 0 && 'None'}
                        {report.relevantScore &&
                          report.relevantScore.map((score, i) => (
                            <GridContainer key={i}>
                              <GridItem key={`${i}-${score.name}`} xs={12}>
                                {score.name}:
                              </GridItem>
                              {score.score.map(({ title, value }, y) => (
                                <GridItem key={y + i} xs={12}>
                                  {title}: {value}
                                </GridItem>
                              ))}
                            </GridContainer>
                          ))}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Perceived health quality: {report.health}
                      </GridItem>
                      <GridItem xs={12}>
                        Perceived quality of life: {report.qualityOfLife}
                      </GridItem>
                      <GridItem xs={12}>
                        Perceived health satisfaction:{' '}
                        {report.healthSatisfaction}
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        Global expection of change (pain):{' '}
                        {report.globalExpectationOfChange.pain}/10
                      </GridItem>
                      <GridItem xs={12}>
                        Global expection of change (function):{' '}
                        {report.globalExpectationOfChange.function}/10
                      </GridItem>
                      <GridItem xs={12}>
                        Global expection of change (quality of life):{' '}
                        {report.globalExpectationOfChange.qualityOfLife}/10
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>Diagnosis: {report.diagnosis}</GridItem>
                      <GridItem xs={12}>
                        Number of treatment: {report.numberOfTreatments}
                      </GridItem>
                      <GridItem xs={12}>
                        Frequency : {report.frequency}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        Objectives:{' '}
                        {report.objectives.toString()
                          ? report.objectives.toString()
                          : 'None'}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        Plan of management:{' '}
                        {report.objectives.toString()
                          ? report.objectives.toString() +
                            (report.planOfManagementOther.toString()
                              ? report.planOfManagementOther.toString()
                              : '')
                          : 'None'}
                      </GridItem>
                      {report.planOfManagementExternalConsultation && (
                        <GridItem xs={12}>
                          <br />
                          External Consultation:{' '}
                          {report.planOfManagementExternalConsultation}
                        </GridItem>
                      )}
                      <GridItem xs={12}>
                        <br />
                        Global Expectation Of Clinical Change:{' '}
                        {report.globalExpectationOfClinicalChange}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button onClick={() => history.goBack()} color='danger'>
                  {t('professional.patient.back')}
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      )}
    </>
  );
};

Report.propTypes = {
  getPatient: PropTypes.func.isRequired,
  professional: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
})(withRouter(Report));

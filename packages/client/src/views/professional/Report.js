import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { withRouter } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';

import ReportPDF from './ReportPDF';

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
        <GridContainer justifyContent='center'>
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
                        {t('report.name')}: {patient.name}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('professional.patient.gender')}:{' '}
                        {patient.gender === 'Male' ||
                        patient.gender === 'Female'
                          ? t(`professional.patient.${patient.gender}`)
                          : patient.gender}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.age')}: {report.age}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12} sm={6}>
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.date')}:{' '}
                        {format(
                          zonedTimeToUtc(parseISO(report.date)),
                          'yyyy/MM/dd'
                        )}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.professional')}: {report.professionalName}
                      </GridItem>
                      <GridItem xs={12}>
                        {/* #TODO Translate the profession */}
                        {t('report.profession')}:{' '}
                        {report.professionalProfession}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.civilStatus')}: {report.civilStatus}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.nbChildrens')}: {report.nbChildrens}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.occupation')}: {report.occupation}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.employmentStatus')}:{' '}
                        {report.employmentStatus}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.chiefComplaint')}: {report.chiefComplaint}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.onsetDate')}: {report.chiefComplaintStart}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.onsetType')}: {report.chiefComplaintAppear}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.injuryMechanism')}:{' '}
                        {report.chiefComplaintAppearDescription}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.evolution')}: {report.chiefComplaintEvolving}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.recurrence')}:{' '}
                        {report.chiefComplaintRecurrence}
                      </GridItem>

                      {report.otherComplaints && (
                        <GridItem xs={12}>
                          {t('report.secondaryComplaints')}:{' '}
                          {report.otherComplaints}
                        </GridItem>
                      )}
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {report.comorbidities.length > 0 &&
                          report.comorbidities.map((comorbidity, i) => (
                            <GridContainer key={`${i}-${comorbidity.name}1`}>
                              <GridItem
                                key={`${i}-${comorbidity.name}`}
                                xs={12}
                              >
                                {t('report.comorbidity')}:{' '}
                                {t(`report.${comorbidity.name}`)}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.treatment}`}
                                xs={12}
                              >
                                {t('report.isReveivingTreatment')}:{' '}
                                {comorbidity.treatment}
                              </GridItem>
                              <GridItem
                                key={`${i}-${comorbidity.activityLimitation}`}
                                xs={12}
                              >
                                {t('report.activityLimitation')}:{' '}
                                {comorbidity.activityLimitation}
                              </GridItem>
                            </GridContainer>
                          ))}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        {t('report.redFlags')}:{' '}
                        {report.redFlags.toString()
                          ? report.redFlags.join(', ')
                          : t('report.none')}
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.relevantScores')}:{' '}
                        {report.relevantScore.length === 0 && t('report.none')}
                        {report.relevantScore &&
                          report.relevantScore.map((score, i) => (
                            <GridContainer key={i}>
                              <GridItem key={`${i}-${score.name}`} xs={12}>
                                {score.name} (
                                {format(
                                  zonedTimeToUtc(
                                    parseISO(score.date),
                                    Intl.DateTimeFormat().resolvedOptions()
                                      .timeZone
                                  ),
                                  'yyyy/MM/dd'
                                )}
                                ):
                              </GridItem>
                              {score.score.map(({ title, value }, y) => (
                                <GridItem key={y + i} xs={12}>
                                  {t(`professional.patient.score.${title}`)}:{' '}
                                  {value}
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
                        {t('report.healthQuality')}: {report.health}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.qualityOfLife')}: {report.qualityOfLife}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.healthSatisfaction')}:{' '}
                        {report.healthSatisfaction}
                      </GridItem>
                    </GridContainer>
                  </GridItem>

                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      <GridItem xs={12}>
                        {t('report.gecPain')}:{' '}
                        {report.globalExpectationOfChange.pain}/10
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.gecFunction')}:{' '}
                        {report.globalExpectationOfChange.function}/10
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.gecQualityOfLife')}:{' '}
                        {report.globalExpectationOfChange.qualityOfLife}/10
                      </GridItem>
                    </GridContainer>
                  </GridItem>
                  <GridItem xs={12}>
                    <br />
                    <GridContainer>
                      {report.comments && (
                        <GridItem xs={12}>
                          {t('report.comments')}: {report.comments}
                        </GridItem>
                      )}
                      <GridItem xs={12}>
                        {t('report.diagnosis')}: {report.diagnosis}
                      </GridItem>
                      {report.additionalDiagnosis && (
                        <GridItem xs={12}>
                          {t('report.additionalDiagnosis')}:{' '}
                          {report.additionalDiagnosis}
                        </GridItem>
                      )}
                      <GridItem xs={12}>
                        {t('report.nbTx')}: {report.numberOfTreatments}
                      </GridItem>
                      <GridItem xs={12}>
                        {t('report.frequency')}: {report.frequency}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        {t('report.objectives')}:{' '}
                        {report.objectives.toString()
                          ? report.objectives
                              .map((item) => t(`report.${item}`))
                              .join(', ')
                          : t('report.none')}
                      </GridItem>
                      <GridItem xs={12}>
                        <br />
                        {t('report.planOfManagement')}:{' '}
                        {report.planOfManagement.toString()
                          ? report.planOfManagement
                              .map((item) => t(`report.techniques.${item}`))
                              .join(', ') +
                            (report.planOfManagementOther.toString()
                              ? ', ' + report.planOfManagementOther.join(', ')
                              : '')
                          : t('report.none')}
                      </GridItem>
                      {report.planOfManagementExternalConsultation && (
                        <GridItem xs={12}>
                          <br />
                          {t('report.externalConsultation')}:{' '}
                          {report.planOfManagementExternalConsultation}
                        </GridItem>
                      )}
                      <GridItem xs={12}>
                        <br />
                        {t('report.gecc')}:{' '}
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
                <PDFDownloadLink
                  document={<ReportPDF report={report} patient={patient} />}
                  fileName={`report-${patient.name}.pdf`}
                >
                  <Button color='info'>
                    {t('professional.patient.export')}
                  </Button>
                </PDFDownloadLink>
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
};

const mapStateToProps = (state) => ({
  professional: state.professional,
});

export default connect(mapStateToProps, {
  getPatient,
})(withRouter(Report));

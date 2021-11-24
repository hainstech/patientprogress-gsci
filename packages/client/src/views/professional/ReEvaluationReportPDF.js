import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';

import areasJSON from '../../assets/bodyMap.json';

const styles = StyleSheet.create({
  credits: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 3,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleSection: {
    margin: 10,
    flexGrow: 1,
  },
  answersContainer: {
    margin: 10,
  },
  answerRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  answer: {
    fontSize: 12,
    margin: 4,
    flexGrow: 1,
    padding: 4,
    border: '1px solid #d3d3d3',
    borderRadius: 5,
  },
  subSectionTitle: {
    fontSize: 12,
    margin: 4,
    flexGrow: 1,
    padding: 4,
  },
  subtitle: {
    fontSize: 16,
    margin: 10,
  },
  pageJump: {
    margin: 10,
  },
});

// Create Document Component
const ReEvaluationReportPDF = ({ report, patient }) => {
  const { t } = useTranslation();
  return (
    <Document>
      <Page size="A4">
        <View style={styles.credits}>
          <Text>{t('pdf.generated')}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleSection}>
            {t('report.reEvaluationReport')}
          </Text>
          <Text style={styles.titleSection}>
            {patient.name} -{' '}
            {format(zonedTimeToUtc(parseISO(report.date)), 'yyyy/MM/dd')}
          </Text>
        </View>
        <View style={styles.answersContainer}>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.name')}: {patient.name}
            </Text>
            <Text style={styles.answer}>
              {t('register.gender')}:{' '}
              {patient.gender === 'Male' || patient.gender === 'Female'
                ? t(`professional.patient.${patient.gender}`)
                : patient.gender}
            </Text>
            <Text style={styles.answer}>
              {t('report.dob')}:{' '}
              {format(
                zonedTimeToUtc(
                  parseISO(report.dob),
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                ),
                'yyyy/MM/dd'
              )}
            </Text>
            <Text style={styles.answer}>
              {t('report.age')}: {report.age}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.date')}:{' '}
              {format(zonedTimeToUtc(parseISO(report.date)), 'yyyy/MM/dd')}
            </Text>
            <Text style={styles.answer}>
              {t('report.initialReportDate')}:{' '}
              {format(
                zonedTimeToUtc(parseISO(report.initialReportDate)),
                'yyyy/MM/dd'
              )}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.professional')}: {report.professionalName}
            </Text>

            <Text style={styles.answer}>
              {t('report.profession')}: {report.professionalProfession}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.chiefComplaint')}: {report.chiefComplaint}
            </Text>
            <Text style={styles.answer}>
              {t('report.onsetDate')}: {report.chiefComplaintStart}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.initialGlobalExpectationOfClinicalChange')}:{' '}
              {report.initialGlobalExpectationOfClinicalChange}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.chiefComplaintInitialDiagnosis')}:{' '}
              {report.chiefComplaintInitialDiagnosis}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            {report.otherComplaints !== '' && (
              <Text style={styles.answer}>
                {t('report.secondaryComplaints')}: {report.otherComplaints}
              </Text>
            )}
          </View>
          <View wrap={false} style={styles.answerRow}>
            {report.secondaryComplaintInitialDiagnosis !== '' && (
              <Text style={styles.answer}>
                {t('report.secondaryComplaintInitialDiagnosis')}:{' '}
                {report.secondaryComplaintInitialDiagnosis}
              </Text>
            )}
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.relatedPainAreas')}:{' '}
              {report.relatedPainAreas.toString()
                ? areasJSON
                    .filter(({ id }) => report.relatedPainAreas.includes(id))
                    .map(({ title }) => title)
                    .join(', ')
                : t('report.none')}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.allPainAreas')}:{' '}
              {report.allPainAreas.toString()
                ? areasJSON
                    .filter(({ id }) => report.allPainAreas.includes(id))
                    .map(({ title }) => title)
                    .join(', ')
                : t('report.none')}
            </Text>
          </View>
          {report.comorbidities.map((comorbidity, i) => (
            <View key={i} wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.comorbidity')}: {t(`report.${comorbidity.name}`)},{' '}
                {t('report.activityLimitation')}:{' '}
                {comorbidity.activityLimitation},{' '}
                {t('report.isReveivingTreatment')}: {comorbidity.treatment}
              </Text>
            </View>
          ))}
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.redFlags')}:{' '}
              {report.redFlags.toString()
                ? report.redFlags.join(', ')
                : t('report.none')}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.relevantScores')}:{' '}
              {report.relevantScore.length === 0 && t('report.none')}
            </Text>
          </View>
          {report.relevantScore.length !== 0 &&
            report.relevantScore.map((score, i) => (
              <View key={i} wrap={false} style={styles.answerRow}>
                <Text style={styles.answer}>
                  {score.name} (
                  {format(
                    zonedTimeToUtc(
                      parseISO(score.date),
                      Intl.DateTimeFormat().resolvedOptions().timeZone
                    ),
                    'yyyy/MM/dd'
                  )}
                  ):,{' '}
                  {score.score.map(({ title, value, improvement }) => {
                    return `${t(`professional.patient.score.${title}`)}: ${
                      /\d/.test(value)
                        ? value
                        : t(`professional.patient.score.${value}`)
                    } ${
                      improvement !== undefined && improvement > 0
                        ? `(${Math.round(improvement)})%`
                        : ``
                    }, `;
                  })}
                </Text>
              </View>
            ))}
          <View wrap={false} style={styles.subtitle}>
            <Text>{t('report.improvement')}</Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.improvementPain')}: {report.improvementPain}
              /10
            </Text>
            <Text style={styles.answer}>
              {t('report.improvementFunction')}: {report.improvementFunction}/10
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.improvementQualityOfLife')}:{' '}
              {report.improvementQualityOfLife}/10
            </Text>
          </View>

          <View wrap={false} style={styles.subtitle}>
            <Text>{t('report.satisfaction')}</Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.treatmentsSatisfaction')}:{' '}
              {report.treatmentsSatisfaction}/10
            </Text>
            <Text style={styles.answer}>
              {t('report.chiropractorSatisfaction')}:{' '}
              {report.chiropractorSatisfaction}/10
            </Text>
          </View>

          <View wrap={false} style={styles.subtitle}>
            <Text>{t('report.filledProfessional')}</Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.investigationResults')}: {report.investigationResults}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.additionalInvestigation')}:{' '}
              {report.additionalInvestigation}
            </Text>
          </View>

          {report.additionalInvestigationSpecify !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.specify')}: {report.additionalInvestigationSpecify}
              </Text>
            </View>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.neckOrLowerBackCondition')}:{' '}
              {report.neckOrLowerBackCondition}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            {report.spinalDiagnosticClassification !== '' && (
              <Text style={styles.answer}>
                {t('report.spinalDiagnosticClassification.title')}:{' '}
                {report.spinalDiagnosticClassification}
              </Text>
            )}
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.diagnosis')}: {report.diagnosis}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            {report.additionalDiagnosis !== '' && (
              <Text style={styles.answer}>
                {t('report.additionalDiagnosis')}: {report.additionalDiagnosis}
              </Text>
            )}
          </View>

          <View wrap={false} style={styles.answerRow}>
            {report.differentialDiagnosis !== '' && (
              <Text style={styles.answer}>
                {t('report.differentialDiagnosis')}:{' '}
                {report.differentialDiagnosis}
              </Text>
            )}
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.numberOfTreatmentsProvided')}:{' '}
              {report.numberOfTreatmentsProvided}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.numberOfAdditionalTreatments')}:{' '}
              {report.numberOfAdditionalTreatments}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.frequency')}: {report.frequency}
            </Text>
          </View>
          {report.frequencySpecify !== '' && (
            <Text style={styles.answer}>
              {t('report.specify')}: {report.frequencySpecify}
            </Text>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gicc')}: {report.globalImpressionOfClinicalChange}/10
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.maximalMedicalImprovement')}:{' '}
              {report.maximalMedicalImprovement}
            </Text>
          </View>

          {report.maximalMedicalImprovementSpecify !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.specify')}: {report.maximalMedicalImprovementSpecify}
              </Text>
            </View>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.objectives.title')}:{' '}
              {report.objectives.toString()
                ? report.objectives
                    .map((item) => t(`report.objectives.${item}`))
                    .join(', ')
                : t('report.none')}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.planOfManagement')}:{' '}
              {report.planOfManagement.toString()
                ? report.planOfManagement
                    .map((item) => t(`report.techniques.${item}`))
                    .join(', ') +
                  (report.planOfManagementOther.toString()
                    ? ', ' + report.planOfManagementOther.join(', ')
                    : '')
                : t('report.none')}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.currentEmploymentStatus')}:{' '}
              {report.currentEmploymentStatus}
            </Text>
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.continueActivities')}: {report.continueActivities}
            </Text>
          </View>

          {report.continueActivitiesSpecify !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.specify')}: {report.continueActivitiesSpecify}
              </Text>
            </View>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.functionalLimitation')}: {report.functionalLimitation}
            </Text>
          </View>

          {report.functionalLimitationSpecify !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.specify')}: {report.functionalLimitationSpecify}
              </Text>
            </View>
          )}

          {report.referenceList.length !== 0 && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.reference.to')}:{' '}
                {report.referenceList.toString() &&
                  report.referenceList
                    .map((item) => t(`report.reference.${item}`))
                    .join(', ') +
                    (report.referenceListOther
                      ? ', ' + report.referenceListOther
                      : '')}
              </Text>
            </View>
          )}

          {report.referenceListReason !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.reference.reason')}: {report.referenceListReason}
              </Text>
            </View>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gecc')}: {report.globalExpectationOfClinicalChange}/10
            </Text>
          </View>
          {report.globalExpectationOfClinicalChangeSpecify !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.specify')}:{' '}
                {report.globalExpectationOfClinicalChangeSpecify}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default ReEvaluationReportPDF;

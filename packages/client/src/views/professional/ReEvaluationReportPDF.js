import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';

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
      <Page size='A4'>
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
                    console.log(improvement);
                    return `${t(`professional.patient.score.${title}`)}: ${
                      /\d/.test(value)
                        ? value
                        : t(`professional.patient.score.${value}`)
                    } ${
                      improvement !== undefined
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
            {report.comments !== '' && (
              <Text style={styles.answer}>
                {t('report.comments')}: {report.comments}
              </Text>
            )}
          </View>

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.diagnosis')}: {report.diagnosis}
            </Text>
            {report.additionalDiagnosis !== '' && (
              <Text style={styles.answer}>
                {t('report.additionalDiagnosis')}: {report.additionalDiagnosis}
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
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.objectives')}:{' '}
              {report.objectives.toString()
                ? report.objectives
                    .map((item) => t(`report.${item}`))
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

          {report.planOfManagementExternalConsultation !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.externalConsultation')}:{' '}
                {report.planOfManagementExternalConsultation}
              </Text>
            </View>
          )}
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gicc')}: {report.globalImpressionOfClinicalChange}/10
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gecc')}: {report.globalExpectationOfClinicalChange}/10
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReEvaluationReportPDF;

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
const ReportPDF = ({ report, patient }) => {
  const { t } = useTranslation();
  return (
    <Document>
      <Page size='A4'>
        <View style={styles.credits}>
          <Text>{t('pdf.generated')}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleSection}>Report</Text>
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
              {t('report.professional')}: {report.professionalName}
            </Text>
            <Text style={styles.answer}>
              {t('report.profession')}: {report.professionalProfession}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.civilStatus')}: {report.civilStatus}
            </Text>
            <Text style={styles.answer}>
              {t('report.nbChildrens')}: {report.nbChildrens}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.occupation')}: {report.occupation}
            </Text>
            <Text style={styles.answer}>
              {t('report.employmentStatus')}: {report.employmentStatus}
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
              {t('report.onsetType')}: {report.chiefComplaintAppear}
            </Text>
            <Text style={styles.answer}>
              {t('report.evolution')}: {report.chiefComplaintEvolving}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.injuryMechanism')}:{' '}
              {report.chiefComplaintAppearDescription}
            </Text>
          </View>
          {/* here */}
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.recurrence')}: {report.chiefComplaintRecurrence}
            </Text>
            {report.otherComplaints !== '' && (
              <Text style={styles.answer}>
                {t('report.secondaryComplaints')}: {report.otherComplaints}
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
              Red flags:{' '}
              {report.redFlags.toString()
                ? report.redFlags.join(', ')
                : t('report.none')}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Relevant scores:{' '}
              {report.relevantScore.length === 0 && t('report.none')}
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
                      {score.score.map(
                        ({ title, value }) =>
                          `${t(
                            `professional.patient.score.${title}`
                          )}: ${value}`
                      )}
                    </Text>
                  </View>
                ))}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.healthQuality')}: {report.health}
            </Text>
            <Text style={styles.answer}>
              {t('report.qualityOfLife')}: {report.qualityOfLife}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.healthSatisfaction')}: {report.healthSatisfaction}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gecPain')}: {report.globalExpectationOfChange.pain}/10
            </Text>
            <Text style={styles.answer}>
              {t('report.gecFunction')}:{' '}
              {report.globalExpectationOfChange.function}/10
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              {t('report.gecQualityOfLife')}:{' '}
              {report.globalExpectationOfChange.qualityOfLife}/10
            </Text>
          </View>
          <View wrap={false} style={styles.subtitle}>
            <Text>Filled by the professional</Text>
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
              {t('report.nbTx')}: {report.numberOfTreatments}
            </Text>
            <Text style={styles.answer}>
              {t('report.frequency')}: {report.frequency}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Objectives:{' '}
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
              {t('report.gecc')}: {report.globalExpectationOfClinicalChange}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;

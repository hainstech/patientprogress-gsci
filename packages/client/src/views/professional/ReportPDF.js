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
    border: '1px solid black',
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
            <Text style={styles.answer}>Patient's Name: {patient.name}</Text>
            <Text style={styles.answer}>
              {t('register.gender')}:{' '}
              {patient.gender === 'Male' || patient.gender === 'Female'
                ? t(`professional.patient.${patient.gender}`)
                : patient.gender}
            </Text>
            <Text style={styles.answer}>Age: {report.age}</Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Date:{' '}
              {format(zonedTimeToUtc(parseISO(report.date)), 'yyyy/MM/dd')}
            </Text>
            <Text style={styles.answer}>
              Professional's Name: {report.professionalName}
            </Text>
            <Text style={styles.answer}>
              Profession: {report.professionalProfession}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Civil status: {report.civilStatus}
            </Text>
            <Text style={styles.answer}>
              Number of children: {report.nbChildrens}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>Occupation: {report.occupation}</Text>
            <Text style={styles.answer}>
              Employment status: {report.employmentStatus}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Chief complaint: {report.chiefComplaint}
            </Text>
            <Text style={styles.answer}>
              Chief complaint region: {report.chiefComplaintRegion}
            </Text>
            <Text style={styles.answer}>
              Chief complaint start: {report.chiefComplaintStart}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Chief complaint appearance: {report.chiefComplaintAppear}
            </Text>
            <Text style={styles.answer}>
              Chief complaint evolving: {report.chiefComplaintEvolving}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Chief complaint description:{' '}
              {report.chiefComplaintAppearDescription}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Chief complaint reccurence: {report.chiefComplaintRecurrence}
            </Text>
            {report.otherComplaints && (
              <Text style={styles.answer}>
                Other complaints: {report.otherComplaints}
              </Text>
            )}
          </View>
          {report.comorbidities.length === 0 && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>No commorbidities</Text>
            </View>
          )}
          {report.comorbidities.map((comorbidity, i) => (
            <View key={i} wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                Comorbidity: {comorbidity.name}, Activity limitaion:{' '}
                {comorbidity.activityLimitation}, Under treatment:{' '}
                {comorbidity.treatment}
              </Text>
            </View>
          ))}
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Red flags:{' '}
              {report.redFlags.toString() ? report.redFlags.toString() : 'None'}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Relevant scores: {report.relevantScore.length === 0 && 'None'}
              {report.relevantScore &&
                report.relevantScore.map((score, i) => (
                  <View key={i} wrap={false} style={styles.answerRow}>
                    <Text style={styles.answer}>
                      {score.name},{' '}
                      {score.score.map(
                        ({ title, value }, y) => `${title}: ${value}`
                      )}
                    </Text>
                  </View>
                ))}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Perceived health quality: {report.health}
            </Text>
            <Text style={styles.answer}>
              Perceived quality of life: {report.qualityOfLife}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Perceived health satisfaction: {report.healthSatisfaction}
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Global expection of change (pain):{' '}
              {report.globalExpectationOfChange.pain}/10
            </Text>
            <Text style={styles.answer}>
              Global expection of change (function):{' '}
              {report.globalExpectationOfChange.function}/10
            </Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Global expection of change (quality of life):{' '}
              {report.globalExpectationOfChange.qualityOfLife}/10
            </Text>
          </View>
          <View wrap={false} style={styles.subtitle}>
            <Text>Filled by the professional</Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>Diagnosis: {report.diagnosis}</Text>
            <Text style={styles.answer}>
              Number of treatment: {report.numberOfTreatments}
            </Text>
            <Text style={styles.answer}>Frequency : {report.frequency}</Text>
          </View>
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Objectives:{' '}
              {report.objectives.toString()
                ? report.objectives.toString()
                : 'None'}
            </Text>
          </View>
          {/* {marker} */}
          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Plan of management:{' '}
              {report.planOfManagement.toString()
                ? report.planOfManagement.toString() +
                  (report.planOfManagementOther.toString()
                    ? report.planOfManagementOther.toString()
                    : '')
                : 'None'}
            </Text>
          </View>

          {report.planOfManagementExternalConsultation !== '' && (
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                External Consultation:{' '}
                {report.planOfManagementExternalConsultation}
              </Text>
            </View>
          )}

          <View wrap={false} style={styles.answerRow}>
            <Text style={styles.answer}>
              Global Expectation Of Clinical Change:{' '}
              {report.globalExpectationOfClinicalChange}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ReportPDF;

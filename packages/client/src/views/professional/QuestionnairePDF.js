import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';
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
    marginTop: 10,
    flexGrow: 1,
    padding: 4,
    border: '1px solid #d3d3d3',
    borderRadius: 5,
  },
  subSectionTitle: {
    fontSize: 14,
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

const getAnswer = (answers, key) => {
  const answer = answers.find((e) => e.key === key);
  if (answer)
    return {
      text: `${answer.title}: ${answer.value}`,
      title: answer.title,
      value: answer.value,
      key: answer.key,
    };
  return false;
};

const checkOther = (answers, answer) => {
  const { key, title, value } = answer;
  const answerVal =
    answer.value === 'Other' ||
    answer.value === 'Autre' ||
    answer.value === 'Other professional' ||
    answer.value === 'Professionnel de la santé'
      ? getAnswer(answers, `${key}Other`).value
      : value;
  return `${title}: ${answerVal}`;
};

const getMultipleAnswer = (answers, key) => {
  const answersArray = answers.filter((e) => e.key === key);
  if (answersArray.length > 0) {
    const valueArray = answersArray.map(({ value }) => value);
    return `${answersArray[0].title}: ${valueArray.join(', ')}`;
  }

  return false;
};

const checkAffirmative = (answers, key) => {
  const { value } = answers.find((e) => e.key === key);
  const isTrue = value === 'Yes' || value === 'Oui';
  return isTrue;
};

const GetCommorbidities = ({ answers }) => {
  const keys = [
    'commorbidityHeart.heartDisease',
    'commorbidityBloodPressure.highBloodPressure',
    'commorbidityLungDisease.lungDisease',
    'commorbidityDiabetes.diabetes',
    'commorbidityUlcer.ulcerStomachDisease',
    'commorbidityKidney.kidneyDisease',
    'commorbidityLiver.liverDisease',
    'commorbidityAnemia.anemia',
    'commorbidityCancer.cancer',
    'commorbidityDepression.depression',
    'commorbidityOsteoarthritis.osteoarthritis',
    'commorbidityRheumatoidArthritis.rheumatoidArthritis',
  ];
  return (
    <>
      {keys.map(
        (key, i) =>
          checkAffirmative(answers, key) && (
            <React.Fragment key={i}>
              <View wrap={false} style={styles.answerRow}>
                <Text style={styles.answer}>
                  {getAnswer(answers, key).text}
                </Text>
              </View>
              <View wrap={false} style={styles.answerRow}>
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      `${key.split('.')[0]}.activityLimitation`
                    ).text
                  }
                </Text>
              </View>
              <View wrap={false} style={styles.answerRow}>
                <Text style={styles.answer}>
                  {getAnswer(answers, `${key.split('.')[0]}.treatment`).text}
                </Text>
              </View>
            </React.Fragment>
          )
      )}
    </>
  );
};

// Create Document Component
const QuestionnairePDF = ({ questionnaire, patient, answers }) => {
  const { t } = useTranslation();
  return (
    <Document>
      <Page size="A4">
        <View style={styles.credits}>
          <Text>{t('pdf.generated')}</Text>
        </View>
        <View style={styles.title}>
          <Text style={styles.titleSection}>{`${
            questionnaire && questionnaire.title
          } (${questionnaire && questionnaire.questionnaire.language})`}</Text>
          <Text style={styles.titleSection}>{`${patient.name} - ${dayjs(
            questionnaire.time
          ).format('YYYY/MM/DD')}`}</Text>
        </View>
        <View wrap={false} style={styles.subtitle}>
          <Text>{t('professional.patient.answers')}:</Text>
        </View>
        {questionnaire.title !== 'Initial Intake Form' ? (
          <View wrap={false} style={styles.answersContainer}>
            {answers.map(({ title, value }, i) => (
              <Text key={i} style={styles.answer}>
                {title}: {value}
              </Text>
            ))}
          </View>
        ) : (
          <View style={styles.answersContainer}>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>{t('pdf.fileOpening')}</Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('register.gender')}:{' '}
                {patient.gender === 'Male' || patient.gender === 'Female'
                  ? t(`professional.patient.${patient.gender}`)
                  : patient.gender}
              </Text>
              <Text style={styles.answer}>
                {t('register.dob')}: {dayjs(patient.dob).format('YYYY/MM/DD')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'address').text},{' '}
                {getAnswer(answers, 'city').value},{' '}
                {getAnswer(answers, 'province').value},{' '}
                {getAnswer(answers, 'postalCode').value}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'homePhoneNumber').text}
              </Text>
              <Text style={styles.answer}>
                {getAnswer(answers, 'officePhoneNumber').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'cellularPhoneNumber').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.generalInformation')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'civilStatus').text}
              </Text>
              <Text style={styles.answer}>
                {getAnswer(answers, 'nbChildrens').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {checkOther(
                  answers,
                  getAnswer(
                    answers,
                    'employmentStatusSelection.employmentStatus'
                  )
                )}
              </Text>
              <Text style={styles.answer}>
                {getAnswer(answers, 'occupation').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'accidentSelector.accident').text}
              </Text>
              {getAnswer(answers, 'accidentSelector.accidentAgentName') && (
                <Text style={styles.answer}>
                  {
                    getAnswer(answers, 'accidentSelector.accidentAgentName')
                      .text
                  }
                </Text>
              )}
              {getAnswer(answers, 'accidentSelector.accidentFileNumber') && (
                <Text style={styles.answer}>
                  {
                    getAnswer(answers, 'accidentSelector.accidentFileNumber')
                      .text
                  }
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {
                  getAnswer(
                    answers,
                    'extendedCoverageSelector.extendedCoverage'
                  ).text
                }
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(
                answers,
                'extendedCoverageSelector.extendedCoverageInsuranceName'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      'extendedCoverageSelector.extendedCoverageInsuranceName'
                    ).text
                  }
                </Text>
              )}
              {getAnswer(
                answers,
                'extendedCoverageSelector.extendedCoveragePolicyNumber'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      'extendedCoverageSelector.extendedCoveragePolicyNumber'
                    ).text
                  }
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {
                  getAnswer(answers, 'familyPhysicianSelector.familyPhysician')
                    .text
                }
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(
                answers,
                'familyPhysicianSelector.familyPhysicianName'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      'familyPhysicianSelector.familyPhysicianName'
                    ).text
                  }
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(
                answers,
                'familyPhysicianSelector.familyPhysicianAddress'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      'familyPhysicianSelector.familyPhysicianAddress'
                    ).text
                  }
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(
                answers,
                'familyPhysicianSelector.lastAppointmentDate'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(
                      answers,
                      'familyPhysicianSelector.lastAppointmentDate'
                    ).text
                  }
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'referenceSelector.reference').text}
              </Text>
              {getAnswer(answers, 'referenceSelector.referenceOther') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'referenceSelector.referenceOther').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'emergencyName').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'emergencyPhone').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'emailContact').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'weight').text}
              </Text>
              <Text style={styles.answer}>
                {getAnswer(answers, 'height').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.chiefComplaint')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.relatedPainAreas')}:{' '}
                {answers
                  .filter((e) => e.key === 'relatedPainAreas')
                  .map((e) => e.value).length > 0
                  ? areasJSON
                      .filter(({ id }) =>
                        answers
                          .filter((e) => e.key === 'relatedPainAreas')
                          .map((e) => e.value)
                          .includes(id)
                      )
                      .map(({ title }) => title)
                      .join(', ')
                  : t('report.none')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {t('report.allPainAreas')}:{' '}
                {answers
                  .filter((e) => e.key === 'relatedPainAreas')
                  .map((e) => e.value).length > 0
                  ? areasJSON
                      .filter(({ id }) =>
                        answers
                          .filter((e) => e.key === 'relatedPainAreas')
                          .map((e) => e.value)
                          .includes(id)
                      )
                      .map(({ title }) => title)
                      .join(', ')
                  : t('report.none')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'chiefComplaint').text}
              </Text>
            </View>

            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'chiefComplaintStart').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'chiefComplaintAppear').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(answers, 'chiefComplaintAppearDescription') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'chiefComplaintAppearDescription').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'chiefComplaintEvolving').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'chiefComplaintRecurrence').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {checkOther(
                  answers,
                  getAnswer(answers, 'consultedSelection.consulted')
                )}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getAnswer(answers, 'otherComplaints') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'otherComplaints').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {checkOther(
                  answers,
                  getAnswer(
                    answers,
                    'completedMedicalInvestigationSelector.completedMedicalInvestigation'
                  )
                )}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>{t('pdf.redflags')}</Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'RFS_fall').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getMultipleAnswer(answers, 'RFS_diagnosis') && (
                <Text style={styles.answer}>
                  {getMultipleAnswer(answers, 'RFS_diagnosis')}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getMultipleAnswer(answers, 'RFS_suffered') && (
                <Text style={styles.answer}>
                  {getMultipleAnswer(answers, 'RFS_suffered')}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {getMultipleAnswer(answers, 'RFS_symptoms') && (
                <Text style={styles.answer}>
                  {getMultipleAnswer(answers, 'RFS_symptoms')}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.comorbidities')}
              </Text>
            </View>
            <GetCommorbidities answers={answers} />
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>{t('pdf.medication')}</Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {
                  getAnswer(answers, 'medicationSelector.currentlyMedicated')
                    .text
                }
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'medicationSelector.currentlyMedicated'
              ) && (
                <Text style={styles.answer}>
                  {getMultipleAnswer(
                    answers,
                    'medicationSelector.medicationList'
                  )}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'medicationSelector.currentlyMedicated'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(answers, 'medicationSelector.specificMedication')
                      .text
                  }
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'surgerySelector.surgery').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'surgerySelector.surgery') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'surgerySelector.description').text}
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {
                  getAnswer(answers, 'hospitalizationSelector.hospitalization')
                    .text
                }
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'hospitalizationSelector.hospitalization'
              ) && (
                <Text style={styles.answer}>
                  {
                    getAnswer(answers, 'hospitalizationSelector.description')
                      .text
                  }
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'severeTraumaSelector.severeTrauma').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'severeTraumaSelector.severeTrauma'
              ) && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'severeTraumaSelector.description').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.familyHistory')}
              </Text>
            </View>

            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'motherSelector.mother') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'motherSelector.mother').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'motherSelector.mother') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'motherSelector.explanation').text}
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'fatherSelector.father') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'fatherSelector.father').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'fatherSelector.father') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'fatherSelector.explanation').text}
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'siblingsSelector.siblings') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'siblingsSelector.siblings').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(answers, 'siblingsSelector.siblings') && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'siblingsSelector.explanation').text}
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'grandparentsSelector.grandparents'
              ) && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'grandparentsSelector.grandparents').text}
                </Text>
              )}
            </View>
            <View wrap={false} style={styles.answerRow}>
              {checkAffirmative(
                answers,
                'grandparentsSelector.grandparents'
              ) && (
                <Text style={styles.answer}>
                  {getAnswer(answers, 'grandparentsSelector.explanation').text}
                </Text>
              )}
            </View>

            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.qualityOfLife')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'health').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'qualityOfLife').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'healthSatisfaction').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'PAVSExercise').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'PAVSExerciseMinutes').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'PAVSMuscle').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'globalExpectationOfChange.pain').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'globalExpectationOfChange.function').text}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {
                  getAnswer(answers, 'globalExpectationOfChange.qualityOfLife')
                    .text
                }
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.subSectionTitle}>
                {t('pdf.examinationConsent')}
              </Text>
            </View>
            <View wrap={false} style={styles.answerRow}>
              <Text style={styles.answer}>
                {getAnswer(answers, 'consent').text}
              </Text>
            </View>
          </View>
        )}

        {questionnaire.score.length > 0 && (
          <>
            <View wrap={false} style={styles.subtitle}>
              <Text>{t('professional.patient.score.score')}:</Text>
            </View>
            <View wrap={false} style={styles.answersContainer}>
              {questionnaire.score.map(({ title, value }) => (
                <Text key={title} style={styles.answer}>
                  {t(`professional.patient.score.${title}`)}:{' '}
                  {/\d/.test(value)
                    ? value
                    : t(`professional.patient.score.${value}`)}
                </Text>
              ))}
            </View>
          </>
        )}
      </Page>
    </Document>
  );
};

export default QuestionnairePDF;

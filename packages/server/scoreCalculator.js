module.exports = {
  scoreCalculator: function (title, answers) {
    let scores = [];
    switch (title) {
      case 'Follow-up questionnaire':
        scores = [
          {
            title: 'globalImpressionOfChange',
            value:
              (Object.values(answers)
                .slice(0, 3)
                .reduce((a, b) => a + parseInt(b), 0) /
                30) *
                100 +
              '/100',
          },
        ];
        break;
      case 'Neck Disability Index':
        let total = Object.values(answers).reduce((a, b) => a + parseInt(b), 0);
        let interpretation = '';

        if (total < 5) {
          interpretation = 'noDisability';
        } else if (total < 15) {
          interpretation = 'mildDisability';
        } else if (total < 25) {
          interpretation = 'moderateDisability';
        } else if (total < 35) {
          interpretation = 'severeDisability';
        } else if (total < 51) {
          interpretation = 'completeDisability';
        }

        scores = [
          {
            title: 'total',
            value: `${total * 2}/100`,
          },
          {
            title: 'interpretation',
            value: interpretation,
          },
        ];
        break;
      case 'Brief Pain Inventory':
        let BPIAnswers = Object.values(answers);
        const interferenceScore = Object.values(answers)
          .slice(4)
          .reduce((a, b) => a + parseInt(b), 0);

        let interferenceInterpretation = '';

        if (interferenceScore < 15) {
          interferenceInterpretation = 'lowInterference';
        } else if (interferenceScore < 43) {
          interferenceInterpretation = 'moderateInterference';
        } else if (interferenceScore < 71) {
          interferenceInterpretation = 'severeInterference';
        }

        const activityInterference =
          parseInt(BPIAnswers[4]) +
          parseInt(BPIAnswers[6]) +
          parseInt(BPIAnswers[7]);

        let activityInterferenceInterpretation = '';

        if (activityInterference < 7) {
          activityInterferenceInterpretation = 'lowInterference';
        } else if (activityInterference < 19) {
          activityInterferenceInterpretation = 'moderateInterference';
        } else if (activityInterference < 31) {
          activityInterferenceInterpretation = 'severeInterference';
        }

        const affectiveInterference =
          parseInt(BPIAnswers[5]) +
          parseInt(BPIAnswers[8]) +
          parseInt(BPIAnswers[10]);

        let affectiveInterferenceInterpretation = '';

        if (affectiveInterference < 7) {
          affectiveInterferenceInterpretation = 'lowInterference';
        } else if (affectiveInterference < 16) {
          affectiveInterferenceInterpretation = 'moderateInterference';
        } else if (affectiveInterference < 31) {
          affectiveInterferenceInterpretation = 'severeInterference';
        }

        scores = [
          {
            title: 'pain',
            value:
              Object.values(answers)
                .slice(0, 4)
                .reduce((a, b) => a + parseInt(b), 0) + '/40',
          },
          {
            title: 'worstPain',
            value: `${answers.BPIPainWorst}/10`,
          },
          {
            title: 'averagePain',
            value: `${answers.BPIPainAverage}/10`,
          },
          {
            title: 'interference',
            value: `${interferenceScore}/70`,
          },
          {
            title: 'interferenceInterpretation',
            value: interferenceInterpretation,
          },
          {
            title: 'activityInterference',
            value: `${activityInterference}/30`,
          },
          {
            title: 'activityInterferenceInterpretation',
            value: activityInterferenceInterpretation,
          },
          {
            title: 'affectiveInterference',
            value: `${affectiveInterference}/30`,
          },
          {
            title: 'affectiveInterferenceInterpretation',
            value: affectiveInterferenceInterpretation,
          },
        ];
        break;
      case 'Modified MSK STarT Back Screening Tool':
      case 'The Keele STarT Back Screening Tool':
        let totalSB = Object.values(answers).reduce(
          (a, b) =>
            a +
            (b === "D'accord" ||
            b === 'Agree' ||
            b === 'Very much' ||
            b === 'Extremely' ||
            b === 'Beaucoup' ||
            b === 'Extrêmement'
              ? 1
              : 0),
          0
        );
        const sub = Object.values(answers)
          .slice(4)
          .reduce(
            (a, b) =>
              a +
              (b === "D'accord" ||
              b === 'Agree' ||
              b === 'Very much' ||
              b === 'Extremely' ||
              b === 'Beaucoup' ||
              b === 'Extrêmement'
                ? 1
                : 0),
            0
          );
        scores = [
          {
            title: 'total',
            value: totalSB,
          },
          {
            title: 'sub',
            value: sub,
          },
          {
            title: 'risk',
            value: totalSB < 4 ? 'low' : sub < 4 ? 'medium' : 'high',
          },
        ];
        break;
      case 'Oswestry Disability Index':
        let denominatorODI = '50';
        Object.values(answers).forEach((value) => {
          if (parseInt(value) < 0) denominatorODI = '45';
        });
        let totalODI = Object.values(answers).reduce(
          (a, b) => a + (parseInt(b) > 0 ? parseInt(b) : 0),
          0
        );
        let interpretationODI = '';

        if (totalODI < 5) {
          interpretationODI = 'noDisability';
        } else if (totalODI < 15) {
          interpretationODI = 'mildDisability';
        } else if (totalODI < 25) {
          interpretationODI = 'moderateDisability';
        } else if (totalODI < 35) {
          interpretationODI = 'severeDisability';
        } else if (totalODI < 51) {
          interpretationODI = 'completeDisability';
        }

        scores = [
          {
            title: 'total',
            value: `${totalODI}/${denominatorODI}`,
          },
          {
            title: 'interpretation',
            value: interpretationODI,
          },
        ];
        break;
      case 'QuickDASH':
        scores = [
          {
            title: 'disability/symptom',
            value:
              Math.round(
                ((Object.values(answers.activities).reduce(
                  (a, b) => a + parseInt(b),
                  0
                ) +
                  Object.values(answers.symptoms).reduce(
                    (a, b) => a + parseInt(b),
                    0
                  )) /
                  11 -
                  1) *
                  25
              ) + `/100`,
          },
        ];

        if (answers.work.work === 'Oui' || answers.work.work === 'Yes')
          scores.push({
            title: 'work',
            value:
              Math.round(
                (Object.values(answers.work).reduce(
                  (a, b) => a + (/^-?\d+$/.test(b) ? parseInt(b) : 0),
                  0
                ) /
                  4 -
                  1) *
                  25
              ) + `/100`,
          });
        if (answers.sport.sport === 'Oui' || answers.sport.sport === 'Yes')
          scores.push({
            title: 'sport',
            value:
              Math.round(
                (Object.values(answers.work).reduce(
                  (a, b) => a + (/^-?\d+$/.test(b) ? parseInt(b) : 0),
                  0
                ) /
                  4 -
                  1) *
                  25
              ) + `/100`,
          });
        break;
      case 'Lower Extremity Functional Scale (LEFS)':
        scores = [
          {
            title: 'total',
            value:
              Object.values(answers).reduce((a, b) => a + parseInt(b), 0) +
              '/80',
          },
        ];
        break;
      default:
        break;
    }
    return scores;
  },
};

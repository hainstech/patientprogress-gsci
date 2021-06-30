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
        scores = [
          {
            title: 'total',
            value:
              Object.values(answers).reduce((a, b) => a + parseInt(b), 0) * 2 +
              '/100',
          },
        ];
        break;
      case 'Brief Pain Inventory':
        scores = [
          {
            title: 'pain',
            value:
              Object.values(answers)
                .slice(0, 4)
                .reduce((a, b) => a + parseInt(b), 0) + '/40',
          },
          {
            title: 'interference',
            value:
              Object.values(answers)
                .slice(4)
                .reduce((a, b) => a + parseInt(b), 0) + '/70',
          },
        ];
        break;

      case 'The Keele STarT Back Screening Tool':
        const total = Object.values(answers).reduce(
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
            value: total,
          },
          {
            title: 'sub',
            value: sub,
          },
          {
            title: 'risk',
            value: total < 4 ? 'Low' : sub < 4 ? 'Medium' : 'High',
          },
        ];
        break;
      case 'Oswestry Disability Index':
        let denominatorODI = '50';
        Object.values(answers).forEach((value) => {
          if (parseInt(value) < 0) denominatorODI = '45';
        });
        scores = [
          {
            title: 'total',
            value:
              Object.values(answers).reduce(
                (a, b) => a + (parseInt(b) > 0 ? parseInt(b) : 0),
                0
              ) + `/${denominatorODI}`,
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

const express = require('express');
const router = express.Router();

const Questionnaire = require('../../models/Questionnaire');
const Patient = require('../../models/Patient');

const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const patient = require('../../middleware/patient');
const professional = require('../../middleware/professional');

// @route GET api/questionnaires
// @desc Get all questionnaires
// @access Admin
router.get('/', admin, async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/questionnaires/list
// @desc Get all questionnaires in list format
// @access Professional
router.get('/list', professional, async (req, res) => {
  try {
    let questionnaires = await Questionnaire.find();
    questionnaires = questionnaires.map(({ _id, title, language }) => {
      return { id: _id, title, language };
    });
    res.json(questionnaires);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route POST api/questionnaires
// @desc Create new questionnaire
// @access Admin
router.post('/', admin, async (req, res) => {
  try {
    const { schema, uischema, title } = req.body;
    const newQuestionnaire = new Questionnaire({ schema, uischema, title });
    const questionnaire = await newQuestionnaire.save();
    res.status(201).json(questionnaire);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/questionnaires/:id
// @desc Get questionnaire by ID
// @access auth
router.get('/:id', auth, async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);

    if (!questionnaire) {
      return res.status(404).json({ msg: 'Questionnaire not found' });
    }

    res.json(questionnaire);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Questionnaire not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route POST api/questionnaires/:id
// @desc Post filled questionnaire
// @access patient
router.post('/:id', patient, async (req, res) => {
  try {
    const { title, data } = req.body;

    var completedQuestionnaire = {
      questionnaire: req.params.id,
      time: new Date(),
      answers: data,
      title,
    };

    const patient = await Patient.findOne({ user: req.user.id });

    patient.questionnairesToFill.splice(
      patient.questionnairesToFill.indexOf(req.params.id),
      1
    );

    if (title === 'Initial Intake Form') {
      let questionnairesToSend = [];

      let questionnaires = await Questionnaire.find();

      let questionnaireList = questionnaires.map(({ _id, title, language }) => {
        return { id: _id, title, language };
      });

      const getQuestionnaireId = (title) => {
        const foundQ = questionnaireList.find(
          (q) => q.title === title && q.language === patient.language
        );

        if (foundQ) {
          return foundQ.id;
        } else {
          return questionnaireList.find(
            (q) => q.title === title && q.language === 'en'
          ).id;
        }
      };

      switch (data.chiefComplaintRegion) {
        case 'Cou':
        case 'Neck pain':
          questionnairesToSend.push(
            getQuestionnaireId('Neck Disability Index')
          );
          break;
        case 'Bas du dos':
        case 'Low back pain':
          questionnairesToSend.push(
            getQuestionnaireId('Oswestry Disability Index'),
            getQuestionnaireId('The Keele STarT Back Screening Tool')
          );
          break;
        case 'Membre supérieur (épaule, coude ou poignet)':
        case 'Upper extremity (shoulder, elbow or wrist)':
          questionnairesToSend.push(getQuestionnaireId('QuickDASH'));
          break;
        case 'Membre inférieur (hanche,genou ou cheville)':
        case 'Lower extremity (hip, knee or ankle)':
          questionnairesToSend.push(
            getQuestionnaireId('Lower Extremity Functional Scale (LEFS)')
          );
          break;
        case 'Aucune de ces régions':
        case 'Not in the options':
          break;
        default:
          break;
      }

      questionnairesToSend.forEach((id) => {
        patient.questionnairesToFill.push({
          questionnaire: id,
          date: new Date(),
        });
      });
    }

    patient.questionnaires.push(completedQuestionnaire);

    await patient.save();

    res.json(patient);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Questionnaire not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
    console.error(err);
  }
});

module.exports = router;

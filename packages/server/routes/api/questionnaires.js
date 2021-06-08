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

    let answers = [];

    Object.entries(data).forEach(([key, value]) => {
      answers.push({ questionId: key, answer: value.toString() });
    });

    var completedQuestionnaire = {
      questionnaire: req.params.id,
      time: new Date(),
      answers,
      title,
    };

    const patient = await Patient.findOne({ user: req.user.id });

    patient.questionnaires.push(completedQuestionnaire);

    patient.questionnairesToFill.splice(
      patient.questionnairesToFill.indexOf(req.params.id),
      1
    );

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

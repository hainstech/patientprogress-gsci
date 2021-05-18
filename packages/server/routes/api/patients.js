const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Professional = require('../../models/Professional');
const Patient = require('../../models/Patient');
const User = require('../../models/User');

const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const professional = require('../../middleware/professional');
const patient = require('../../middleware/patient');

// @route GET api/patients
// @desc Get all patients
// @access Admin
router.get('/', admin, async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/patients/me
// @desc Get logged in patient's profile
// @access Patient
router.get('/me', patient, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate(
      'user professional questionnairesToFill'
    );
    patient.professional.patients = undefined;
    patient.professional.user = undefined;
    patient.user = undefined;
    patient.questionnaires = undefined;
    patient.reports = undefined;

    res.json(patient);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/patients/all
// @desc Get all patients of a professional
// @access professional
router.get('/all', professional, async (req, res) => {
  try {
    const currentProfessional = await Professional.findOne({
      user: req.user.id,
    }).populate('patients');

    // map or filter through
    res.json(currentProfessional.patients);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/patients/short
// @desc Get all patients of a professional but only name, dob and id for optimisation
// @access professional
router.get('/short', professional, async (req, res) => {
  try {
    const currentProfessional = await Professional.findOne({
      user: req.user.id,
    }).populate('patients');
    let liste = currentProfessional.patients.map(({ id, name, dob }) => ({
      id,
      name,
      dob,
    }));
    res.json(liste);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/patients/:id
// @desc Get patient by ID
// @access professional
router.get('/:id', professional, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate({
      path: 'questionnaires.questionnaire',
    });

    const currentUser = await User.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    if (
      patient.professional.toString() != currentUser.professionalId.toString()
    ) {
      return res.status(400).json({ msg: 'Permission denied' });
    }

    res.json(patient);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Patient not found' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route PUT api/patients/
// @desc Update logged in patient's profile
// @access patient
router.put(
  '/',
  [
    patient,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('dob', 'Enter a valid date following the YYYY-MM-DD format')
        .isISO8601()
        .toDate(),
      check('language', 'Language is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, dob, language } = req.body;

    try {
      const patient = await Patient.findOne({ user: req.user.id });

      patient.name = name;
      patient.dob = dob;
      patient.language = language;

      await patient.save();

      res.json(patient);
    } catch (err) {
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route PUT api/patients/:id
// @desc Update patient by ID
// @access professional
router.put('/:id', professional, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: 'Patient not found' });
    }

    if (
      patient.professional.toString() != currentUser.professionalId.toString()
    ) {
      return res.status(403).json({ msg: 'Permission denied' });
    }

    if (req.body.report) patient.reports.push(req.body.report);
    if (req.body.questionnaireToFill)
      patient.questionnairesToFill.push(req.body.questionnaireToFill);

    await patient.save();

    res.json(patient);
  } catch (err) {
    console.log(err);
    if (err.kind == 'ObjectId') {
      return res.status(404).json({ msg: 'Object error' });
    }
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;

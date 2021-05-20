const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Professional = require('../../models/Professional');

const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');
const professional = require('../../middleware/professional');
const patient = require('../../middleware/patient');

// @route GET api/professionals
// @desc Get all professionals
// @access Admin
router.get('/', admin, async (req, res) => {
  try {
    const professionals = await Professional.find();
    res.json(professionals);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/professionals/me
// @desc Get logged in professional's profile
// @access Professional
router.get('/me', professional, async (req, res) => {
  try {
    const professional = await Professional.findOne({
      user: req.user.id,
    }).populate('patients');
    res.json(professional);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/professionals/me/full
// @desc Get logged in professional's profile with populated patients
// @access Professional
router.get('/me/full', professional, async (req, res) => {
  try {
    const professional = await Professional.findOne({
      user: req.user.id,
    }).populate('patients');

    res.json(professional);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route GET api/professionals/myprofessional
// @desc Get logged in patient's professional
// @access Patient
router.get('/myprofessional', patient, async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const professional = await Professional.findById(
      patient.professional
    ).select(['-patients', '-user']);

    res.json(professional);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route PUT api/professional
// @desc Update professional's profile
// @access Professional
router.put(
  '/',
  [
    professional,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('clinic', 'Clinic is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('language', 'Language is required').not().isEmpty(),
      check('phone', 'Please enter a valid phone number').isMobilePhone(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, clinic, description, language, phone } = req.body;

    try {
      const professional = await Professional.findOne({ user: req.user.id });
      professional.name = name;
      professional.clinic = clinic;
      professional.description = description;
      professional.language = language;
      professional.phone = phone;

      await professional.save();

      res.json(professional);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

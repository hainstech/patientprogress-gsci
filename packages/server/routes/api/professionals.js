const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');

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
    const {
      _id,
      name,
      clinic,
      description,
      language,
      phone,
      user,
      profession,
      patients,
      profile,
    } = professional;

    // Return only the essential fields for optimisation
    const shortProfessional = {
      _id,
      name,
      clinic,
      description,
      language,
      phone,
      user,
      profession,
      profile,
      patients: patients.map(({ name, _id, dob }) => {
        return { name, _id, dob };
      }),
    };
    res.json(shortProfessional);
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

// @route PUT api/professionals
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

    const {
      name,
      clinic,
      description,
      language,
      phone,
      yearDegree,
      country,
      meanNbPatients,
      practiceDescription,
      otherDegree,
      manipulativeTechniques,
      nonAdjustiveTechniques,
    } = req.body;

    try {
      const professional = await Professional.findOne({ user: req.user.id });
      professional.name = name;
      professional.clinic = clinic;
      professional.description = description;
      professional.language = language;
      professional.phone = phone;
      professional.profile.yearDegree = yearDegree;
      professional.profile.country = country;
      professional.profile.meanNbPatients = meanNbPatients;
      professional.profile.practiceDescription = practiceDescription;
      professional.profile.otherDegree = otherDegree;
      professional.profile.manipulativeTechniques = manipulativeTechniques;
      professional.profile.nonAdjustiveTechniques = nonAdjustiveTechniques;

      await professional.save();

      res.json(professional);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route POST api/professionals/invite
// @desc Invite a new patient
// @access Professional
router.post(
  '/invite',
  [professional, check('email', 'Please include a valid email').isEmail()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { _id: id } = await Professional.findOne({
        user: req.user.id,
      }).select('_id');

      const url = `https://app.patientprogress.ca/register/${id}`;

      const transporter = nodemailer.createTransport({
        host: '***REMOVED***',
        port: 465,
        secure: true,
        auth: {
          user: 'dominic@hainstech.com',
          pass: '***REMOVED***',
        },
      });

      const emailContent = {
        from: '"PatientProgress" <no-reply@hainstech.com>',
        to: req.body.email,
        subject: 'PatientProgress Invitation Link',
        html: `<h3>Welcome to PatientProgress!</h3><a href="${url}">Click here to register into the application.</a><br><p>Thank you,</p><p>The PatientProgress Team</p>`,
      };

      transporter.sendMail(emailContent);

      res.status(202).json({ msg: 'sent' });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

module.exports = router;

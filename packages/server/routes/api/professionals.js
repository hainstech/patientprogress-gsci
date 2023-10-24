const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
const config = require('config');
const bcrypt = require('bcryptjs');

const Professional = require('../../models/Professional');
const Patient = require('../../models/Patient');
const User = require('../../models/User');

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
      dataConsent,
      participantConsent,
      terms,
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
      dataConsent,
      participantConsent,
      terms,
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
      check('dataConsent', 'Data consent is required').isBoolean(),
      check(
        'participantConsent',
        'Participant consent is required'
      ).isBoolean(),
      check('terms', 'Accepting the terms is required').isBoolean(),
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
      yearOfBirth,
      yearDegree,
      country,
      college,
      otherDegree,
      otherDegreeSpecify,
      averagePatientsVisits,
      averageNewPatients,
      practiceDescription,
      radiologyService,
      techniques,
      dataConsent,
      participantConsent,
      terms,
    } = req.body;

    try {
      if (!terms) {
        return res.status(400).json({
          errors: [{ msg: 'Please accept the terms to use the application' }],
        });
      }

      const professional = await Professional.findOne({ user: req.user.id });
      professional.name = name;
      professional.clinic = clinic;
      professional.description = description;
      professional.language = language;
      professional.phone = phone;
      professional.profile = {
        yearOfBirth,
        yearDegree,
        country,
        college,
        otherDegree,
        otherDegreeSpecify,
        averagePatientsVisits,
        averageNewPatients,
        practiceDescription,
        radiologyService,
        techniques,
      };
      professional.dataConsent = dataConsent;
      professional.participantConsent = participantConsent;
      professional.terms = terms;

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

      const url = `https://gsci-dot-yoki-355502.ue.r.appspot.com/register/${id}`;

      const transporter = nodemailer.createTransport({
        host: config.get('nodemailerHost'),
        port: config.get('nodemailerPort'),
        secure: true,
        auth: {
          user: config.get('nodemailerUser'),
          pass: config.get('nodemailerPass'),
        },
      });

      const emailContent = {
        from: '"PatientProgress" <no-reply@hainstech.com>',
        to: req.body.email,
        subject: 'PatientProgress: inscription | registration',
        html: `<p>Cher.ère patient.e,</p><p>Vous venez de prendre un rendez-vous avec votre chiropraticien.ne. Tel que demandé, pourriez-vous maintenant vous inscrire sur l’application web PatientProgress en suivant ce lien. </p><a href="${url}">${url}</a> <p> Vous pourrez alors compléter les questionnaires que votre chiropraticien.ne a besoin pour l’aider à préparer votre première consultation et définir les soins de santé dont vous pourriez avoir besoin. </p><br/> <p>Merci beaucoup,</p><p>L’équipe PatientProgress</p><br/> <hr/> <br/> <p>Dear Patient,</p><p> You have just scheduled an appointment with your chiropractor. As requested, could you now register on the Web App PatientProgress using the following link. </p><a href="${url}">${url}</a> <p> You will then be able to complete the questionnaires your chiropractor need to prepare your first visit and to define the health care you may need. </p><br/> <p>Thank you,</p><p>The PatientProgress Team</p>`,
      };

      transporter.sendMail(emailContent);

      res.status(202).json({ msg: 'sent' });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  }
);

// @route POST api/professionals/register
// @desc Register a new patient
// @access Professional
router.post(
  '/register',
  [
    professional,
    [
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 8 or more characters'
      ).isLength({ min: 8 }),
      check('name', 'Name is required').not().isEmpty(),
      check('dob', 'Enter a valid date following the YYYY-MM-DD format')
        .isISO8601()
        .toDate(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('language', 'Language is required').not().isEmpty(),
      check('research', 'Consent is required').isBoolean(),
      check('dataConsent', 'Data consent is required').isBoolean(),
      check(
        'participantConsent',
        'Participant consent is required'
      ).isBoolean(),
      check(
        'terms',
        'Please accept the terms to use the application'
      ).isBoolean(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      name,
      dob,
      gender,
      language,
      research,
      dataConsent,
      participantConsent,
      terms,
    } = req.body;

    try {
      if (!terms) {
        return res.status(400).json({
          errors: [{ msg: 'Please accept the terms to use the application' }],
        });
      }

      let professionalFound = await Professional.findOne({
        user: req.user.id,
      });

      if (!professionalFound) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid professional ID' }] });
      }

      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        type: 'patient',
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //@feature create patient file

      // Get initial questionnaires to send
      const initialIntake = await Questionnaire.findOne({
        title: 'Pre-visit Intake Form',
        language,
      });

      let patient = new Patient({
        name,
        dob,
        gender,
        language,
        research,
        user: user.id,
        professional: professionalFound.id,
        dataConsent,
        participantConsent,
        questionnairesToFill: [
          {
            questionnaire: initialIntake._id,
            date: new Date(),
            sent: true,
          },
        ],
      });

      user.patientId = patient.id;

      await patient.save();
      await user.save();

      //add patientId to professionals patients
      professionalFound.patients.push(patient.id);

      await professionalFound.save();

      res.status(201).json({ msg: 'Patient registered' });
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Invalid professional ID' }] });
      }
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

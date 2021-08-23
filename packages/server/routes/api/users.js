const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const got = require('got');
const rateLimit = require('express-rate-limit');

const User = require('../../models/User');
const Professional = require('../../models/Professional');
const Patient = require('../../models/Patient');
const Questionnaire = require('../../models/Questionnaire');

const admin = require('../../middleware/admin');
const auth = require('../../middleware/auth');

// Rate limiter for register route
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 5, // 5 requests per hour
  handler: function (req, res) {
    return res.status(429).json({ errors: [{ msg: 'Try again later.' }] });
  },
});

// @route POST api/users/
// @desc Register patient: creates user and patient file
// @access Public
router.post(
  '/',
  [
    registerLimiter,
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
      check('professional', 'Professionals id is required').not().isEmpty(),
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
      professional,
      recaptchaValue,
    } = req.body;

    try {
      if (!recaptchaValue) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please complete reCaptcha' }] });
      }

      const { body } = await got.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${config.get(
          'recaptchaSecret'
        )}&response=${recaptchaValue}`,
        { responseType: 'json' }
      );

      if (!body.success) {
        return res.status(400).json({ errors: [{ msg: 'Invalid reCaptcha' }] });
      }

      let professionalFound = await Professional.findById(professional);

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

      // Get initial questionnaires to send: intake + BPI
      const initialIntake = await Questionnaire.findOne({
        title: 'Initial Intake Form',
        language,
      });
      const BPI = await Questionnaire.findOne({
        title: 'Brief Pain Inventory',
        language,
      });

      let patient = new Patient({
        name,
        dob,
        gender,
        language,
        research,
        user: user.id,
        professional,
        questionnairesToFill: [
          {
            questionnaire: initialIntake._id,
            date: new Date(),
            sent: true,
          },
          {
            questionnaire: BPI._id,
            date: new Date(),
            sent: true,
          },
        ],
      });

      user.patientId = patient.id;

      await patient.save();
      await user.save();

      const payload = {
        user: {
          id: user.id,
          type: user.type,
        },
      };

      //add patientId to professionals patients
      professionalFound.patients.push(patient.id);

      await professionalFound.save();

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      if (err.kind == 'ObjectId') {
        return res
          .status(404)
          .json({ errors: [{ msg: 'Invalid professional ID' }] });
      }
      res.status(500).send('Server error');
      console.log(err.message);
    }
  }
);

// @route POST api/users/admin
// @desc Register professional or admin
// @access Admin
router.post(
  '/admin',
  [
    admin,
    [
      check('type', 'Type is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check(
        'password',
        'Please enter a password with 6 or more characters'
      ).isLength({ min: 6 }),
      check('name', 'Name is required').not().isEmpty(),
      check('profession', 'Profession is required').not().isEmpty(),
      check('clinic', 'Clinic is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('language', 'Language is required').not().isEmpty(),
      check('gender', 'Gender is required').not().isEmpty(),
      check('phone', 'Please enter a valid phone number').isMobilePhone(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      type,
      email,
      password,
      name,
      clinic,
      profession,
      description,
      language,
      phone,
      gender,
    } = req.body;

    if (language != 'en' && 'fr') {
      return res.status(400).json({ errors: [{ msg: 'Invalid language' }] });
    }

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        type,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //@feature if professional create profile

      if (type == 'professional') {
        let newProfessionnal = new Professional({
          name,
          profession,
          clinic,
          description,
          language,
          phone,
          user: user.id,
          gender,
        });

        await newProfessionnal.save();

        user.professionalId = newProfessionnal.id;
      }

      await user.save();

      const payload = {
        user: {
          id: user.id,
          type: user.type,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route PUT api/users
// @desc Modify email
// @access Logged in user
router.put(
  '/',
  [auth, [check('email', 'Please include a valid email').isEmail()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      user.email = req.body.email;

      await user.save();

      res.json(user);
    } catch (err) {
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

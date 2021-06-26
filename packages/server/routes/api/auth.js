const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const got = require('got');
const slowDown = require('express-slow-down');

const User = require('../../models/User');

// Slow down requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // allow 100 requests per 15 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

// @route GET api/auth
// @desc Get logged-in users data
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post(
  '/',
  [
    speedLimiter,
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Please enter a password').exists(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, recaptchaValue } = req.body;

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

      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const payload = {
        user: {
          type: user.type,
          id: user.id,
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

// @route POST api/auth/forgot
// @desc Send password reset email to provided email address
// @access Public
router.post(
  '/forgot',
  [speedLimiter, [check('email', 'Please include a valid email').isEmail()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, recaptchaValue } = req.body;

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

      let user = await User.findOne({ email });

      if (!user) {
        return res.status(200).send('OK');
      }

      const payload = {
        email: user.email,
        id: user.id,
      };

      const sendForgotEmail = (token) => {
        const url = `https://app.patientprogress.ca/forgot/${user.id}/${token}`;

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
          subject: 'PatientProgress Password Reset',
          html: `<a href="${url}">Click here to reset your password.</a><p>The link is 1 time use and expires in 1h.</p><br><p>Thank you,</p><p>The PatientProgress Team</p>`,
        };

        transporter.sendMail(emailContent);
      };

      jwt.sign(
        payload,
        `${config.get('jwtSecret')}-${user.password}`,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          sendForgotEmail(token);
          res.status(200).send('OK');
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route POST api/auth/passwordreset
// @desc Reset password
// @access Public
router.post(
  '/passwordreset',
  [
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, id, token, recaptchaValue } = req.body;

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

      let user = await User.findById(id);

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid url' }] });
      }

      const payload = jwt.verify(
        token,
        `${config.get('jwtSecret')}-${user.password}`
      );

      if (payload.id !== id || payload.email !== user.email) {
        return res.status(400).json({ errors: [{ msg: 'Invalid url' }] });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.send('OK');
    } catch (err) {
      res.status(400).json({ errors: [{ msg: 'Invalid url' }] });
    }
  }
);

module.exports = router;

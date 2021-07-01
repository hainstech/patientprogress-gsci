const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const faker = require('faker');

const User = require('../../models/User');
const Professional = require('../../models/Professional');
const Patient = require('../../models/Patient');

const admin = require('../../middleware/admin');

// @route POST api/seeding/:professional_id
// @desc Register patient: creates user and patient file
// @access Admin
router.post('/:professional_id', admin, async (req, res) => {
  try {
    const createPatient = async () => {
      const email = faker.internet.email().toLowerCase();
      const password = faker.internet.password();
      const name = faker.name.findName();
      const dob = faker.date.past();
      const gender = faker.name.gender();
      const language = 'en';
      const research = true;
      const professional = req.params.professional_id;

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

      let patient = new Patient({
        name,
        dob,
        gender,
        language,
        research,
        user: user.id,
        professional,
        questionnairesToFill: [],
      });

      user.patientId = patient.id;

      await patient.save();
      await user.save();

      //add patientId to professionals patients
      professionalFound.patients.push(patient.id);

      await professionalFound.save();
    };

    for (let index = 0; index < 100; index++) {
      await createPatient();
    }

    res.send('Done');
  } catch (err) {
    res.status(500).send('Server error');
    console.log(err.message);
  }
});

router.put('/:professional_id', admin, async (req, res) => {
  try {
    const editPatient = async (id) => {
      let patient = await Patient.findById(id);
      patient.gender = Math.random() < 0.5 ? 'Male' : 'Female';
      await patient.save();
    };

    let professionalFound = await Professional.findById(
      req.params.professional_id
    );

    for (let index = 0; index < professionalFound.patients.length; index++) {
      await editPatient(professionalFound.patients[index]);
    }

    res.send('Done');
  } catch (err) {
    res.status(500).send('Server error');
    console.log(err.message);
  }
});

module.exports = router;

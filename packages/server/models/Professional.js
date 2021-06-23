const mongoose = require('mongoose');

const ProfessionalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  profession: {
    type: String,
    required: true,
  },
  clinic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  yearOfBirth: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },

  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],

  profile: {
    yearDegree: { type: String },
    country: { code: { type: String }, label: { type: String } },
    otherDegree: [{ type: String }],
    meanNbPatients: { type: String },
    practiceDescription: { type: String },
    manipulativeTechniques: [{ type: String }],
    nonAdjustiveTechniques: [{ type: String }],
  },
});

module.exports = Professional = mongoose.model(
  'Professional',
  ProfessionalSchema
);

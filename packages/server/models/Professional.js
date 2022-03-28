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
  dataConsent: {
    type: Boolean,
  },
  participantConsent: {
    type: Boolean,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    yearOfBirth: { type: String },
    yearDegree: { type: String },
    country: { code: { type: String }, label: { type: String } },
    college: { type: String },
    otherDegree: [{ type: String }],
    otherDegreeSpecify: { type: String },
    averagePatientsVisits: { type: String },
    averageNewPatients: { type: String },
    practiceDescription: { type: String },
    radiologyService: { type: String },
    techniques: [{ type: String }],
  },
});

module.exports = Professional = mongoose.model(
  'Professional',
  ProfessionalSchema
);

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

  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],
});

module.exports = Professional = mongoose.model(
  'Professional',
  ProfessionalSchema
);

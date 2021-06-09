var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  research: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
  },

  questionnaires: [
    {
      questionnaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire',
        required: true,
      },
      time: {
        type: Date,
        required: true,
      },
      answers: [
        {
          questionId: String,
          answer: String,
        },
      ],
      title: {
        type: String,
        required: true,
      },
    },
  ],
  reports: [
    {
      time: {
        type: Date,
        required: true,
      },
      chiefComplaint: {
        type: String,
        required: true,
      },
      chiefComplaintStart: {
        type: Date,
        required: true,
      },
      diagnosis: {
        type: String,
        required: true,
      },
      txNb: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      objectives: [String],
      recommendations: [String],
      recommendationDetails: String,
      comorbidity: String, //change to array later
      redFlags: String,
      yellowFlags: [String],
      complications: [String],
      complicationsOther: String,
      expectationPain: {
        type: Number,
        required: true,
      },
      expectationFunction: {
        type: Number,
        required: true,
      },
      expectationQualityOfLife: {
        type: Number,
        required: true,
      },
      expectationClinicalChange: {
        type: Number,
        required: true,
      },
      physicalActivityVitalSign: {
        type: Number,
        required: true,
      },
      consent: String,
      consentComment: String,
      BPIPain: {
        type: Number,
        required: true,
      },
      BPIFunction: {
        type: Number,
        required: true,
      },
    },
  ],
  questionnairesToFill: [
    {
      questionnaire: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire',
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = Patient = mongoose.model('Patient', patientSchema);

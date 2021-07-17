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
      answers: {
        type: mongoose.Schema.Types.Mixed,
        require: true,
      },
      title: {
        type: String,
        required: true,
      },
      score: [
        {
          title: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      timeToComplete: {
        type: Number,
      },
    },
  ],
  reports: [
    {
      age: {
        type: String,
        required: true,
      },
      intakeUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient.questionnaires',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      professionalName: {
        type: String,
        required: true,
      },
      professionalProfession: {
        type: String,
        required: true,
      },
      // Social demographics
      civilStatus: {
        type: String,
        required: true,
      },
      nbChildrens: {
        type: String,
        required: true,
      },
      // Work demographics
      occupation: {
        type: String,
        required: true,
      },
      employmentStatus: {
        type: String,
        required: true,
      },
      physicalActivityVitalSign: {
        type: String,
        required: true,
      },
      // Chief complaint
      chiefComplaint: {
        type: String,
        required: true,
      },
      chiefComplaintRegion: {
        type: String,
        required: true,
      },
      chiefComplaintStart: {
        type: String,
        required: true,
      },
      chiefComplaintAppear: {
        type: String,
        required: true,
      },
      chiefComplaintAppearDescription: {
        type: String,
        required: true,
      },
      chiefComplaintEvolving: {
        type: String,
        required: true,
      },
      chiefComplaintRecurrence: {
        type: String,
        required: true,
      },
      otherComplaints: {
        type: String,
      },
      comorbidities: [
        {
          name: { type: String, required: true },
          treatment: { type: String, required: true },
          activityLimitation: { type: String, required: true },
        },
      ],
      redFlags: [String],
      // Facultative scores
      relevantScore: [
        {
          name: { type: String },
          score: [{ title: { type: String }, value: { type: String } }],
          date: { type: Date },
        },
      ],
      // Quality of Life
      health: { type: String, required: true },
      qualityOfLife: { type: String, required: true },
      healthSatisfaction: { type: String, required: true },
      globalExpectationOfChange: {
        pain: { type: String, required: true },
        function: { type: String, required: true },
        qualityOfLife: { type: String, required: true },
      },
      diagnosis: {
        type: String,
        required: true,
      },
      additionalDiagnosis: {
        type: String,
      },
      numberOfTreatments: {
        type: String,
        required: true,
      },
      frequency: {
        type: String,
        required: true,
      },
      objectives: [String],
      planOfManagement: [String],
      planOfManagementOther: [String],
      planOfManagementExternalConsultation: { type: String },
      globalExpectationOfClinicalChange: { type: String, required: true },
      comments: { type: String },
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
      sent: {
        type: Boolean,
      },
    },
  ],
});

module.exports = Patient = mongoose.model('Patient', patientSchema);

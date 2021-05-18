var mongoose = require('mongoose');

var questionnaireSchema = new mongoose.Schema({
  schema: mongoose.Schema.Types.Mixed,
  uischema: mongoose.Schema.Types.Mixed,
  title: {
    type: String,
    required: true,
  },
  language: {
    type: String,
  },
});

module.exports = Questionnaire = mongoose.model(
  'Questionnaire',
  questionnaireSchema
);

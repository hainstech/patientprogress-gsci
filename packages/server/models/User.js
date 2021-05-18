const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  professionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional',
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
});

module.exports = User = mongoose.model('User', UserSchema);

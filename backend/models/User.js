const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  aadhaar_number: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  phone_number: { type: String, required: true },
  address: String,
  state_of_origin: String,
  skillset: String,
  employment_status: { type: String, enum: ['Employed', 'Unemployed'], default: 'Unemployed' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

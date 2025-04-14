const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  aadhaar: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  skills: { type: [String], default: [] },
  employmentHistory: [
    {
      employer: { type: String, required: true },
      duration: { type: String, required: true },
      role: { type: String, required: true },
    },
  ],
});

const Worker = mongoose.model('Worker', workerSchema);
module.exports = Worker;
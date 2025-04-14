const Worker = require('../models/Worker'); // Assuming you've created this model
const bcrypt = require('bcryptjs');
// const otpGenerator = require('otp-generator'); // You can use any OTP library you like
// const sendOtp = require('../utils/sendOtp'); // Utility function for sending OTP (e.g., via SMS or email)

exports.register = async (req, res) => {
  try {
    const { aadhaar, name, phone, password } = req.body;

    // Check if the worker already exists
    const workerExists = await Worker.findOne({ aadhaar });
    if (workerExists) {
      return res.status(400).json({ error: 'Worker with this Aadhaar already exists' });
    }

    // Encrypt password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new worker
    const worker = new Worker({
      aadhaar,
      name,
      phone,
      password: hashedPassword,
    });

    await worker.save();
    res.status(201).json({ message: 'Worker registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { aadhaar, otp } = req.body;

    // Validate Aadhaar number
    const worker = await Worker.findOne({ aadhaar });
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Validate OTP (this example assumes you have a utility function for OTP)
    const validOtp = await validateOtp(worker.phone, otp);
    if (!validOtp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Generate a session token or JWT if you wish
    const token = generateJwtToken(worker); // Assume a function to create JWT

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper functions (e.g., for OTP validation)
const validateOtp = async (phone, otp) => {
  // Implement OTP validation (e.g., compare with sent OTP)
  return otp === "123456"; // This is just a mock for simplicity
};

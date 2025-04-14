const Employer = require('../models/Employer'); // Assuming you've created this model
const bcrypt = require('bcryptjs');
// const otpGenerator = require('otp-generator'); // OTP generation (use any package you prefer)
// const sendOtp = require('../utils/sendOtp'); // Utility function to send OTP (e.g., via SMS or email)

exports.register = async (req, res) => {
  try {
    const { companyName, aadhaar, phone, otp } = req.body;

    // Check if employer already exists
    const employerExists = await Employer.findOne({ aadhaar });
    if (employerExists) {
      return res.status(400).json({ error: 'Employer with this Aadhaar already exists' });
    }

    // Encrypt password before saving
    const otpHashed = await bcrypt.hash(otp, 12);

    // Create a new employer document
    const employer = new Employer({
      companyName,
      aadhaar,
      phone,
      otp: otpHashed,
    });

    await employer.save();
    res.status(201).json({ message: 'Employer registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { aadhaar, otp } = req.body;

    // Validate Aadhaar number
    const employer = await Employer.findOne({ aadhaar });
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    // Validate OTP
    // const validOtp = await validateOtp(employer.phone, otp);

    if (otp!=Employer.otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Generate JWT or session token
    const token = generateJwtToken(employer); // Assume a function to create JWT

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

const User = require('../models/User');
const Worker = require('../models/Worker'); // Make sure you have this model
const Employer = require('../models/Employer'); // Make sure you have this model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerWorker = async (req , res) => {
  try {
    const { aadhaar, name, dob, phone, address, skills, employmentHistory } = req.body;

    const newWorker = new Worker({
      aadhaar,
      name,
      dob,
      phone,
      address,
      skills,
      employmentHistory,
    });

    await newWorker.save();
    return res.status(201).json({ message: "Worker registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering worker", error });
  }
};

exports.registerEmployer = async (req , res) => {
  try {
    const { companyName, contactPerson, aadhaarGst, email, phone } = req.body;

    const newEmployer = new Employer({
      companyName,
      contactPerson,
      aadhaarGst,
      email,
      phone,
    });

    await newEmployer.save();
    return res.status(201).json({ message: "Employer registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error registering employer", error });
  }
};


// LOGIN with Aadhaar + OTP
exports.login = async (req, res) => {
  const { aadhaar_number, otp } = req.body;
  try {
    console.log("Request body:",req.body);

    const user = await User.findOne({ aadhaar_number : aadhaar_number });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const isMatch = await bcrypt.compare(otp, user.otp);
    if (user.otp !== otp) {
      return res.status(401).json({ error: 'Invalid Aadhaar or OTP' });
    }

    // Clear OTP after login
    user.otp = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};


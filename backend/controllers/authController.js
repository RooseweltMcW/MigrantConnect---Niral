const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER with OTP (hashed)
exports.register = async (req, res) => {
  try {
    const {
      aadhaar_number,
      name,
      dob,
      gender,
      phone_number,
      address,
      state_of_origin,
      skillset,
      employment_status,
      otp,
    } = req.body;

    const existing = await User.findOne({ aadhaar_number });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedOtp = await bcrypt.hash(otp, 10);

    const newUser = new User({
      aadhaar_number,
      name,
      dob,
      gender,
      phone_number,
      address,
      state_of_origin,
      skillset,
      employment_status,
      otp: hashedOtp, // ✅ Store hashed OTP
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// LOGIN with Aadhaar + OTP
exports.login = async (req, res) => {
  try {
    const { aadhaar_number, otp } = req.body;
    console.log("aadhaar_number, otp",aadhaar_number, otp);

    const user = await User.findOne({ aadhaar_number });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
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

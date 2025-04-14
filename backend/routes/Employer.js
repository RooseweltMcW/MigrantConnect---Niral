const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

router.post('/register', employerController.register);
router.post('/login', employerController.login);
// add more like postJob, viewApplicants, etc.

module.exports = router;

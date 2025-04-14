const express = require('express');
const router = express.Router();
const { registerWorker, registerEmployer, login } = require('../controllers/authController');

router.post("/register-worker", registerWorker);
router.post("/register-employer", registerEmployer);
router.post('/login', login);

module.exports = router;

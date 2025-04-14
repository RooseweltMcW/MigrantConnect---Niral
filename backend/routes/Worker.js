const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

router.post('/register', workerController.register);
router.post('/login', workerController.login);
// add more like profile, update, etc.

module.exports = router;

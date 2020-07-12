const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctors');

//Signup 
router.post('/register', doctorController.register);
//Sign-In
router.post('/login', doctorController.createSession);

module.exports = router;
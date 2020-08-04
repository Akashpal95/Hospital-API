const express = require('express');
const router = express.Router();
const passport = require('passport');
const patientController = require('../controllers/patients');

//Register patient
router.post('/register', passport.authenticate('jwt', {session:false}),patientController.register);

//Create patient report
router.post('/:id/create_report', passport.authenticate('jwt', {session:false}),patientController.createReport)

//Show patient records
router.post('/:id/all_reports', patientController.showAllReport)
module.exports = router;
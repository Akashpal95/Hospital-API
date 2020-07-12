const express = require('express');
const router = express.Router();
const passport = require('passport');
const reportController = require('../controllers/reports');

router.post('/:status',passport.authenticate('jwt', {session:false}), reportController.showReports)
module.exports = router;
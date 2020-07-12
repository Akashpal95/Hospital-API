const express = require('express');
const router = express.Router();
router.use(express.urlencoded());
console.log('Router Loaded');

router.use('/doctors', require('./doctors'));
router.use('/patients', require('./patients'));
router.use('/reports', require('./reports'));


//For any further routes access from here
//router.use('/routername', require('./routerfile'));

module.exports = router;
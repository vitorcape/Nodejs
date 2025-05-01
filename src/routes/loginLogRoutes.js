const express = require('express');
const router = express.Router();
const loginLogController = require('../controllers/loginLogController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', auth, adminOnly, loginLogController.getAllLogs);

module.exports = router;
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.get('/', auth, adminOnly, logController.getLogs);

module.exports = router;
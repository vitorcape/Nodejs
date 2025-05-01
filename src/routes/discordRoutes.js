const express = require('express');
const router = express.Router();
const discordAuthController = require('../controllers/discordAuthController');

router.get('/callback', discordAuthController.discordCallback);

module.exports = router;
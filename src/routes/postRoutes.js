const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, postController.criarPost);
router.get('/', postController.buscarPosts);

module.exports = router;
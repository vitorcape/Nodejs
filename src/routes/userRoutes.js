const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Rota pública apenas usada no Postman (não usada no front)
router.post('/', userController.createUser);

// ✅ Somente admin pode ver todos os usuários
router.get('/', auth, adminOnly, userController.getUsers);

// ✅ Todos logados podem ver seu próprio ID
router.get('/:id', auth, userController.getUserById);

// ✅ Todos logados podem editar seu próprio perfil
router.put('/:id', auth, userController.updateUser);

// ✅ Todos logados podem alterar sua própria senha
router.put('/:id/senha', auth, userController.atualizarSenha);

// ✅ Apenas admin pode deletar qualquer usuário
router.delete('/:id', auth, adminOnly, userController.deleteUser);

router.put('/:id/promover', auth, adminOnly, userController.promoverParaAdmin);

module.exports = router;
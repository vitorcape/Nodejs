const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Criar novo usuário
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);

        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Promoveu usuário para admin',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Listar todos os usuários
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Buscar um usuário por ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Buscou um usuário por ID',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar um usuário
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Segurança opcional: impedir que role seja alterado por usuários comuns
    if (updates.role) delete updates.role;

    // Só permite o próprio usuário ou admin editar
    if (req.user.id !== id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Você só pode editar seu próprio perfil' });
    }

    try {
        const user = await User.findByIdAndUpdate(id, updates, { new: true });

        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Atualizou um usuário',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

// Deletar um usuário
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Deleteu um usuário',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Validar a senha
exports.atualizarSenha = async (req, res) => {
    const userId = req.params.id;
    const { senhaAtual, novaSenha } = req.body;

    try {
        const usuario = await User.findById(userId);
        if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha atual incorreta' });

        const novaHash = await bcrypt.hash(novaSenha, 10);
        usuario.senha = novaHash;
        await usuario.save();

        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Atualizou a senha',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.json({ mensagem: 'Senha atualizada com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar senha' });
    }
};

// Promover para Admin
exports.promoverParaAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: 'admin' },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        const registrarLog = require('../utils/registrarLog');

        await registrarLog({
            acao: 'Promoveu usuário para admin',
            autor: {
                id: req.user.id,
                email: req.user.email
            },
            alvo: {
                id: user._id,
                email: user.email
            }
        });

        res.json({ mensagem: 'Usuário promovido a administrador', usuario: user });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao promover usuário' });
    }
};
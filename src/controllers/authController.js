const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// chave secreta (pode vir do .env depois)
const SECRET = 'minha_chave_secreta';

exports.register = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ error: 'Email já cadastrado' });

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await User.create({ nome, email, senha: senhaHash });

        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) return res.status(401).json({ error: 'Senha inválida' });

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};S
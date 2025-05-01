const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// chave secreta (pode vir do .env depois)
const SECRET = 'minha_chave_secreta';

exports.register = async (req, res) => {
    const { nome, nickname, email, senha } = req.body;
    try {
        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ error: 'Email já cadastrado' });

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await User.create({
            nome,
            nickname,
            email,
            senha: senhaHash,
            role: 'user'
        });

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

        jwt.sign(
            {
                id: user._id,
                email: user.email,
                nome: user.nome,
                avatarUrl: user.avatarUrl,
                role: user.role
            },
            SECRET,
            { expiresIn: '1h' }
        );

        const LoginLog = require('../models/LoginLog');

        await LoginLog.create({
            usuario: {
                id: user._id,
                email: user.email
            },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
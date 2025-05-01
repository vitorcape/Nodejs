const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1367606726102351973';
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'kcRcXpdlBJ0A13rA15bj50555fQhDqJN';
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://nodejs-production-b4a4.up.railway.app/auth/discord/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const SECRET = process.env.SECRET || 'minha_chave_secreta';

exports.discordCallback = async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: 'Código não fornecido' });

    try {
        // Trocar o código por um token de acesso
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            scope: 'identify email'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = tokenRes.data;

        // Obter dados do usuário do Discord
        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, username, email } = userRes.data;

        // Criar ou buscar usuário no banco
        let usuario = await User.findOne({ email });
        if (!usuario) {
            usuario = await User.create({
                nome: username,
                email,
                nickname: username.toLowerCase(),
                senha: 'discord', // pode ser substituído por hash aleatório
                role: 'user'
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, role: usuario.role },
            SECRET,
            { expiresIn: '1h' }
        );

        // Redirecionar para o front com o token
        res.redirect(`${FRONTEND_URL}/login?token=${token}`);
    } catch (err) {
        console.error('Erro no login via Discord:', err.response?.data || err.message);
        res.status(500).send('Erro no login com o Discord');
    }
};

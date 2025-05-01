const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = 'minha_chave_secreta'; // use process.env.SECRET se preferir

exports.discordCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) return res.status(400).json({ error: 'Código não fornecido' });

    try {
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: '1367606726102351973',
            client_secret: 'kcRcXpdlBJ0A13rA15bj50555fQhDqJN',
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://localhost:3000/auth/discord/callback',
            scope: 'identify email'
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const { access_token } = tokenRes.data;

        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const { id, username, email } = userRes.data;

        let usuario = await User.findOne({ email });
        if (!usuario) {
            usuario = await User.create({
                nome: username,
                email,
                nickname: username.toLowerCase(),
                senha: 'discord',
                role: 'user'
            });
        }

        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, role: usuario.role },
            SECRET,
            { expiresIn: '1h' }
        );

        res.redirect(`http://localhost:3000/login?token=${token}`);
    } catch (err) {
        console.error('Erro no login via Discord:', err);
        res.status(500).send('Erro no login com o Discord');
    }
};
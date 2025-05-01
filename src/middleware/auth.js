const jwt = require('jsonwebtoken');
const SECRET = 'minha_chave_secreta';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token

    if (!token) return res.status(401).json({ error: 'Token não enviado' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });

        req.user = user;
        next();
    });
};

const jwt = require('jsonwebtoken');
const SECRET = 'minha_chave_secreta';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token não enviado' });

    try {
        const decoded = jwt.verify(token, SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso restrito a administradores' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Token inválido ou expirado' });
    }
};
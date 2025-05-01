const LoginLog = require('../models/LoginLog');

exports.getAllLogs = async (req, res) => {
    try {
        const logs = await LoginLog.find().sort({ data: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar histórico de login' });
    }
};

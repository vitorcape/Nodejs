const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find().sort({ data: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar logs' });
    }
};
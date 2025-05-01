const Log = require('../models/Log');

async function registrarLog({ acao, autor, alvo }) {
    try {
        await Log.create({ acao, autor, alvo });
    } catch (err) {
        console.error('Erro ao salvar log:', err);
    }
}

module.exports = registrarLog;
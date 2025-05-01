const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    acao: String,               // ex: "editou usuário", "promoveu usuário"
    autor: {                    // quem fez a ação
        id: String,
        email: String
    },
    alvo: {                     // sobre quem foi a ação
        id: String,
        email: String
    },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
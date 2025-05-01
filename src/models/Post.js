const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor: {
        id: String,
        nome: String,
        nickname: String,
        email: String,
        avatarUrl: String
    },
    numero: { type: Number, unique: true },
    dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
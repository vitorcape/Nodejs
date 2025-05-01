const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    nickname: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    idade: Number,
    avatarUrl: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
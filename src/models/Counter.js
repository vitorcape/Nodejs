const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  valor: { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
    usuario: {
        id: String,
        email: String
    },
    ip: String,
    userAgent: String,
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoginLog', loginLogSchema);

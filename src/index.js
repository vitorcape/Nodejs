require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logRoutes = require('./routes/logRoutes');
const loginLogRoutes = require('./routes/loginLogRoutes');
const discordRoutes = require('./routes/discordRoutes');
const postRoutes = require('./routes/postRoutes');

require('dotenv').config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const userRoutes = require('./routes/userRoutes'); // <-- esse require aqui!

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',  // ou use '*' para liberar tudo (temporariamente)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/logs', logRoutes);
app.use('/login-logs', loginLogRoutes);
app.use('/auth/discord', discordRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => res.send('API funcionando!'));
app.use('/usuarios', userRoutes); // <-- e esse .use() aqui!

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Serve o React em produção
if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, '../client/build');
    app.use(express.static(clientPath));

    app.get('*', (req, res) => {
        res.sendFile(path.join(clientPath, 'index.html'));
    });
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => console.error(err));

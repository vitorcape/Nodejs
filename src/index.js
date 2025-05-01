const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logRoutes = require('./src/routes/logRoutes');
require('dotenv').config();

console.log("MONGO_URI:", process.env.MONGO_URI);

const userRoutes = require('./routes/userRoutes'); // <-- esse require aqui!

const app = express();
app.use(cors());
app.use(express.json());
app.use('/logs', logRoutes);

app.get('/', (req, res) => res.send('API funcionando!'));
app.use('/usuarios', userRoutes); // <-- e esse .use() aqui!

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
        });
    })
    .catch(err => console.error(err));

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/database');

const app = express();

// Middleware
app.use(express.json());

// Rotas
app.use('/', orderRoutes);

// Conectar ao banco e iniciar servidor
const startServer = async () => {
    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
};

startServer();

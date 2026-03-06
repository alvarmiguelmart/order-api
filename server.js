const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/database');
const swaggerSpec = require('./config/swagger');

const app = express();

// Middleware
app.use(express.json());

// Documentacao Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use('/auth', authRoutes);
app.use('/', orderRoutes);

// Conectar ao banco e iniciar servidor
const startServer = async () => {
    await connectDB();

    app.listen(process.env.PORT, () => {
        console.log(`Servidor rodando na porta ${process.env.PORT}`);
        console.log(`Documentacao Swagger: http://localhost:${process.env.PORT}/api-docs`);
    });
};

startServer();

const express = require('express');
const router = express.Router();

// Importando os roteadores específicos
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');

// Importando o middleware de autenticação
const isAuthenticated = require('../middleware/isAuthenticated');

// Configuração das rotas no roteador principal
router.use('/auth', authRoutes);
router.use('/users', isAuthenticated, userRoutes);
router.use('/tasks', isAuthenticated,taskRoutes)

// Exportação do roteador principal
module.exports = router;
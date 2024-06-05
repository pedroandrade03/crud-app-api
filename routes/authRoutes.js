const express = require('express');
const router = express.Router();

// Importando o controller de autenticação
const authController = require('../controllers/authController');

// Configuração das rotas de autenticação
router.post('/login', authController.login); // Rota de login
router.post('/register', authController.register); // Rota de cadastro de novos usuários

// Exportação do roteador de autenticação
module.exports = router;

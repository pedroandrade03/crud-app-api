const express = require('express');
const router = express.Router();

// Importando o controller de usuários
const userController = require('../controllers/userController');

// Configuração das rotas de usuários
router.get('/', userController.getAllUsers); // Listar todos os usuários
router.put('/:id', userController.updateUser); // Atualizar um usuário por username
router.post('/', userController.createUser); // Criar um novo usuário
router.delete('/:id', userController.deleteUser);  // Deletar um usuário por Username
router.get('/countByRole', userController.countUsersByRole); // Contabilizar os usuários por role

// Exportação do roteador de usuários
module.exports = router;

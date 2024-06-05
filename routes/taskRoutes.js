const express = require('express');
const router = express.Router();

// Importando o controller de tarefas
const taskController = require('../controllers/taskController');

// Configuração das rotas de tarefas
router.get('/', taskController.getAllTasksOfLoggedInUser); // Rota para buscar todas as tarefas do usuário logado
router.post('/', taskController.createTask); // Rota para criar uma nova tarefa
router.put('/:id', taskController.editTask); // Rota para editar uma tarefa
router.delete('/:id', taskController.deleteTask); // Rota para deletar uma tarefa
router.get('/no-owner', taskController.getTasksWithNoOwner); // Rota para buscar tarefas sem dono
router.put('/assign/:id', taskController.assignOwnerToTask); // Rota para atribuir um dono a uma tarefa
 
// Exportação do roteador de tarefas
module.exports = router;
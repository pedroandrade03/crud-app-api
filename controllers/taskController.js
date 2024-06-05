const Task = require('../models/task');
const User = require('../models/user');

const taskController = {
  getAllTasksOfLoggedInUser: async (req, res) => {
    try {
      const tasks = await Task.find({ owner: req.user._id });
      res.json(tasks);
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar tarefas", error: error.message });
    }
  },

  editTask: async (req, res) => {
    const { description, status } = req.body;
    try {
      const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { description, status },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).send({ message: "Tarefa não encontrada ou usuário não autorizado" });
      }
      res.json(updatedTask);
    } catch (error) {
      res.status(500).send({ message: "Erro ao atualizar tarefa", error: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
      if (!deletedTask) {
        return res.status(404).send({ message: "Tarefa não encontrada ou usuário não autorizado" });
      }
      res.send({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
      res.status(500).send({ message: "Erro ao deletar tarefa", error: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const { description } = req.body;
      const newTask = new Task({ description, owner: req.user._id });
      await newTask.save();
      res.status(201).send(newTask);
    } catch (error) {
      res.status(500).send({ message: "Erro ao criar tarefa", error: error.message });
    }
  },

  getTasksWithNoOwner: async (req, res) => {
    try {
      const tasks = await Task.find({ owner: null });
      res.json(tasks);
    } catch (error) {
      res.status(500).send({ message: "Erro ao buscar tarefas sem dono", error: error.message });
    }
  },

  assignOwnerToTask: async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) {
        return res.status(404).send({ message: "Tarefa não encontrada" });
      }
      task.owner = req.user._id;
      await task.save();
      res.json(task);
    } catch (error) {
      res.status(500).send({ message: "Erro ao atribuir dono à tarefa", error: error.message });
    }
  }
};

module.exports = taskController;

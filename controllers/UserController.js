const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validRoles = ['Engenheiro de FE', 'Engenheiro de BE', 'Analista de dados', 'Líder Técnico']; // Define as funções esperadas

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send({ error: "Falha ao obter usuários", message: err.message });
    }
  },
  
  updateUser: async (req, res) => {
    try {
        const { username, email, role, password } = req.body;
        const id = req.params.id;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id },
            { username, email, role, password: await bcrypt.hash(password, 10) },
            { new: true, runValidators: true }
        );

        res.status(200).send(updatedUser);
    } catch (err) {
        res.status(400).send({ error: "Falha ao atualizar usuário", message: err.message });
    }
  },
  
  createUser: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      if (!role || !validRoles.includes(role)) {
        return res.status(400).send({ message: "Papel (role) inválido ou não fornecido. Deve ser um dos seguintes: " + validRoles.join(", ") });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "Usuário já registrado com este e-mail." });
      }
      
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).send({ message: "Nome de usuário já está em uso." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        role,
        password: hashedPassword
      });

      await newUser.save();
      res.status(201).send({ message: "Usuário registrado com sucesso." });
    } catch (error) {
      res.status(500).send({ message: "Erro ao registrar usuário.", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
        const user = await User.findById(req.params.id );
        if (!user) {
            return res.status(404).send({ error: "Usuário não encontrado" });
        }
        await User.findOneAndDelete({ _id: req.params.id });
        res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (err) {
        res.status(500).send({ error: "Falha ao deletar usuário", message: err.message });
    }
  },
  
  countUsersByRole: async (req, res) => {
    try {
      const counts = await User.aggregate([
        { $group: {
          _id: '$role',
          count: { $sum: 1 }
        }}
      ]);

      const countByRole = validRoles.reduce((acc, role) => {
        acc[role] = 0;
        return acc;
      }, {});

      counts.forEach(item => {
        if (countByRole.hasOwnProperty(item._id)) {
          countByRole[item._id] = item.count;
        }
      });

      res.status(200).json(countByRole);
    } catch (err) {
      res.status(500).send({ message: "Erro ao obter a contagem de usuários por função", error: err.message });
    }
  }
};

module.exports = userController;
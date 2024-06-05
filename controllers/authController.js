const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validRoles = ['Engenheiro de FE', 'Engenheiro de BE', 'Analista de dados', 'Líder Técnico'];

const authController = {
  login: async (req, res) => {
    try {
      // Extrair informações do corpo da requisição
      const { email, password } = req.body;

      // Verificar se o usuário existe
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      // Verificar a senha
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).send({ message: "Senha inválida." });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: "Login bem-sucedido.", token });
    } catch (error) {
      res.status(500).send({ message: "Erro ao fazer login.", error: error.message });
    }
  },
  
  register: async (req, res) => {
    try {
      // Extrair informações do corpo da requisição
      const { username, email, password, role } = req.body;

      // Verificar se o role é válido
      if (!role || !validRoles.includes(role)) {
        return res.status(400).send({ message: "Papel (role) inválido ou não fornecido. Deve ser um dos seguintes: " + validRoles.join(", ") });
      }

      // Verificar se o usuário já existe
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "Usuário já registrado com este e-mail." });
      }
      
      // Verificar se o username já está em uso
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).send({ message: "Nome de usuário já está em uso." });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Criar um novo usuário
      const newUser = new User({
        username,
        email,
        role,
        password: hashedPassword
      });

      // Salvar o usuário no banco de dados
      await newUser.save();
      res.status(201).send({ message: "Usuário registrado com sucesso." });
    } catch (error) {
      res.status(500).send({ message: "Erro ao registrar usuário.", error: error.message });
    }
  }
};

module.exports = authController;
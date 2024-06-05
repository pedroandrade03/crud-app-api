const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  // Obter o token do cabeçalho da requisição
  const authHeader = req.headers.authorization;

  // Verificar se o token foi fornecido
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  // Verificar se o token é válido
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Adicionar o usuário decodificado ao objeto request
    req.user = decoded;
    next(); // Passar para o próximo middleware ou controlador
  } catch (error) {
    res.status(400).json({ message: 'Token inválido.' });
  }
};

module.exports = isAuthenticated;

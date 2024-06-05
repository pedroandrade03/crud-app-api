require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Inicializar o express
const app = express();

// Configurar o CORS
app.use(cors());

// Configurar o body-parser
app.use(express.json());
  
// Conectar ao banco de dados
const conn = require('./db/conn');
conn();

// Configurar as rotas
const routes = require('./routes/router');
app.use('/api', routes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
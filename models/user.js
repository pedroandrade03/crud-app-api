const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Engenheiro de FE', 'Engenheiro de BE', 'Analista de dados', 'Líder Técnico'] }
});

module.exports = mongoose.model('User', userSchema);


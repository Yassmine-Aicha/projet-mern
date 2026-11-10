const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  motDePasse: { type: String, required: true }, // toujours haché (bcrypt)
  role: { type: String, enum: ['membre', 'admin'], default: 'membre' },
}));

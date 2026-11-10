const mongoose = require('mongoose');
module.exports = mongoose.model('Commentaire', new mongoose.Schema({
  texte: { type: String, required: true },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true }, // 1 Article -> N Commentaires
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
}));

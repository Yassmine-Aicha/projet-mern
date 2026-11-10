const mongoose = require('mongoose');
module.exports = mongoose.model('Article', new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  contenu: { type: String, required: true },
  categorie: { type: String, enum: ['Annonce', 'Équipe', 'Ventes', 'Événement'], default: 'Annonce' },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // 1 User -> N Articles
  date: { type: Date, default: Date.now },
  modifieLe: { type: Date }, // rempli lors d'une modification (PUT)
}));

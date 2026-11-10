const router = require('express').Router();
const protect = require('../middleware/protect');
const Article = require('../models/Article');
const Commentaire = require('../models/Commentaire');

router.post('/', protect, async (req, res) => {
  try {
    const { texte, article } = req.body;
    if (!texte || !article) return res.status(400).json({ message: 'Texte et article requis' });
    if (!(await Article.exists({ _id: article })))
      return res.status(404).json({ message: 'Article introuvable' });
    const c = await Commentaire.create({ texte, article, auteur: req.userId });
    res.status(201).json(await c.populate('auteur', 'nom role'));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Supprimer : l'auteur du commentaire OU un admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const c = await Commentaire.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Commentaire introuvable' });
    if (c.auteur.toString() !== req.userId && req.role !== 'admin')
      return res.status(403).json({ message: 'Action interdite' });
    await c.deleteOne();
    res.json({ message: 'Commentaire supprimé' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

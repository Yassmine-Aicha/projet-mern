const router = require('express').Router();
const protect = require('../middleware/protect');
const Article = require('../models/Article');
const Commentaire = require('../models/Commentaire');

const fail = (res, e) =>
  res.status(e.name === 'ValidationError' ? 400 : 500).json({ message: e.message });

// Public : liste avec le nom et le rôle de l'auteur (populate)
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().populate('auteur', 'nom role').sort({ date: -1 });
    res.json(articles);
  } catch (e) { fail(res, e); }
});

// Public : commentaires d'un article
router.get('/:id/commentaires', async (req, res) => {
  try {
    const list = await Commentaire.find({ article: req.params.id })
      .populate('auteur', 'nom role').sort({ date: 1 });
    res.json(list);
  } catch (e) { fail(res, e); }
});

// Protégé : créer
router.post('/', protect, async (req, res) => {
  try {
    const { titre, contenu, categorie } = req.body;
    if (!titre || !contenu) return res.status(400).json({ message: 'Titre et contenu requis' });
    const a = await Article.create({ titre, contenu, categorie, auteur: req.userId });
    res.status(201).json(await a.populate('auteur', 'nom role'));
  } catch (e) { fail(res, e); }
});

// Protégé : modifier (seulement l'auteur)
router.put('/:id', protect, async (req, res) => {
  try {
    const a = await Article.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Article introuvable' });
    if (a.auteur.toString() !== req.userId)
      return res.status(403).json({ message: 'Seul l\'auteur peut modifier' });
    const { titre, contenu, categorie } = req.body;
    if (titre) a.titre = titre;
    if (contenu) a.contenu = contenu;
    if (categorie) a.categorie = categorie;
    a.modifieLe = new Date();
    await a.save();
    res.json(await a.populate('auteur', 'nom role'));
  } catch (e) { fail(res, e); }
});

// Protégé : supprimer (l'auteur OU un admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const a = await Article.findById(req.params.id);
    if (!a) return res.status(404).json({ message: 'Article introuvable' });
    if (a.auteur.toString() !== req.userId && req.role !== 'admin')
      return res.status(403).json({ message: 'Action interdite' });
    await Commentaire.deleteMany({ article: a._id });
    await a.deleteOne();
    res.json({ message: 'Article supprimé' });
  } catch (e) { fail(res, e); }
});

module.exports = router;

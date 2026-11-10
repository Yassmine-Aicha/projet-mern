const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Le rôle est stocké dans le token pour que protect le connaisse
const sign = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
const reply = (user) => ({ token: sign(user), user: { id: user._id, nom: user.nom, role: user.role } });

router.post('/register', async (req, res) => {
  try {
    const { nom, email, motDePasse } = req.body;
    if (!nom || !email || !motDePasse)
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: 'Email déjà utilisé' });
    const hash = await bcrypt.hash(motDePasse, 10); // 10 = tours de salage
    // Le rôle n'est JAMAIS lu depuis req.body : tout nouvel inscrit est "membre"
    const user = await User.create({ nom, email, motDePasse: hash });
    res.status(201).json(reply(user));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse)
  return res.status(400).json({ message: 'Email et mot de passe requis' });
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(motDePasse, user.motDePasse)))
      return res.status(401).json({ message: 'Identifiants incorrects' });
    res.json(reply(user));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;

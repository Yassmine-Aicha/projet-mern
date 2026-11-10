const jwt = require('jsonwebtoken');

// Sentinelle : exige "Authorization: Bearer <token>" valide
module.exports = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token manquant' });
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.id;   // qui est connecté
    req.role = decoded.role;   // membre ou admin
    next();
  } catch {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

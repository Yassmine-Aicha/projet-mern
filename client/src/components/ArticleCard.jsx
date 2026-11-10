import { useState, useEffect } from 'react';
import api from '../api';
import { CATEGORIES } from '../categories';

export default function ArticleCard({ article, index, user, onDelete, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [texte, setTexte] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ titre: article.titre, contenu: article.contenu, categorie: article.categorie });
  const [error, setError] = useState('');
  // Charge les commentaires à l'ouverture
useEffect(() => {
  if (open)
    api.get(`/articles/${article._id}/commentaires`)
      .then((r) => setComments(r.data))
      .catch(() => setError('Impossible de charger les commentaires'));
}, [open, article._id]);

const send = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const { data } = await api.post('/commentaires', { texte, article: article._id });
    setComments([...comments, data]);
    setTexte('');
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur réseau');
  }
};

const removeComment = async (id) => {
  try {
    await api.delete(`/commentaires/${id}`);
    setComments(comments.filter((c) => c._id !== id));
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur réseau');
  }
};

const save = async (e) => {
  e.preventDefault();
  setError('');
  try {
    const { data } = await api.put(`/articles/${article._id}`, draft);
    onUpdate(data);
    setEditing(false);
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur réseau');
  }
};

  const isOwner = user && article.auteur?._id === user.id;
  const isAdmin = user?.role === 'admin';

  if (editing)
    return (
      <form className="card art edit" onSubmit={save}>
        <h3>Modifier l'article</h3>
        <input value={draft.titre} onChange={(e) => setDraft({ ...draft, titre: e.target.value })} required />
        <select value={draft.categorie} onChange={(e) => setDraft({ ...draft, categorie: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <textarea rows="4" value={draft.contenu} onChange={(e) => setDraft({ ...draft, contenu: e.target.value })} required />
        {error && <p className="err">{error}</p>}
        <div className="row">
          <button className="btn">Enregistrer</button>
          <button type="button" className="btn ghost" onClick={() => setEditing(false)}>Annuler</button>
        </div>
      </form>
    );

  return (
    <article className={`card art ${isOwner ? 'own' : ''}`}>
      <span className="num">{index === 0 ? '★ À la une' : `N°${String(index).padStart(2, '0')}`}</span>
      <div className="tags">
        <span className={`cat cat-${article.categorie}`}>{article.categorie}</span>
        {isOwner && <span className="mine">Votre article</span>}
      </div>
      <h3>{article.titre}</h3>
      <p>{article.contenu}</p>
      <div className="meta">
        <span className="who">
          <span className="avatar sm">{article.auteur?.nom?.[0] || '?'}</span>
          <span>
            <strong>{article.auteur?.nom || 'Anonyme'}</strong>
            {article.auteur?.role === 'admin' && <span className="badge-admin">Admin</span>}
            <br />
            {new Date(article.date).toLocaleDateString('fr-FR')}
            {article.modifieLe && ' · modifié'}
          </span>
        </span>
        <span>
          <button className="link" onClick={() => setOpen(!open)}>{open ? 'Masquer' : 'Commentaires'}</button>
          {isOwner && <button className="link" onClick={() => setEditing(true)}>Modifier</button>}
          {(isOwner || isAdmin) && <button className="link del" onClick={() => onDelete(article._id)}>Supprimer</button>}
        </span>
      </div>
      {open && (
        <div className="comments">
          {comments.map((c) => (
            <p key={c._id} className="comment">
              <span><strong>{c.auteur?.nom}</strong> — {c.texte}</span>
              {user && (c.auteur?._id === user.id || isAdmin) && (
                <button className="x" title="Supprimer" onClick={() => removeComment(c._id)}>×</button>
              )}
            </p>
          ))}
          {comments.length === 0 && <p className="muted">Pas encore de commentaire.</p>}
          {error && <p className="err">{error}</p>}
          {user && (
            <form onSubmit={send} className="row">
              <input placeholder="Votre commentaire" value={texte} onChange={(e) => setTexte(e.target.value)} required />
              <button className="btn">OK</button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}
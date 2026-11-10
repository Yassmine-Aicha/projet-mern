import { useState } from 'react';
import api from '../api';
import { CATEGORIES } from '../categories';
export default function ArticleForm({ onCreated }) {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/articles', { titre, contenu, categorie });
      onCreated(data);
      setTitre('');
      setContenu('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur réseau');
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Nouvelle publication</h2>
      <input placeholder="Titre" value={titre} onChange={(e) => setTitre(e.target.value)} required />
      <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <textarea rows="3" placeholder="Votre texte…" value={contenu} onChange={(e) => setContenu(e.target.value)} required />
      {error && <p className="err">{error}</p>}
      <button className="btn">Publier</button>
    </form>
  );
}

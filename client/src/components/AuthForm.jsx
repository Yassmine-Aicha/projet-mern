import { useState } from 'react';
import api from '../api';

export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value }); // formulaire contrôlé
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur réseau');
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</h2>
      {mode === 'register' && <input name="nom" placeholder="Nom" value={form.nom} onChange={change} required />}
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
      <input name="motDePasse" type="password" placeholder="Mot de passe" value={form.motDePasse} onChange={change} required />
      {error && <p className="err">{error}</p>}
      <button className="btn">{mode === 'login' ? 'Entrer' : "S'inscrire"}</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'Pas de compte ? Inscription' : 'Déjà inscrit ? Connexion'}
      </button>
    </form>
  );
}

import { useState, useEffect } from 'react';
import api from './api';
import { CATEGORIES } from './categories';
import Navbar from './components/Navbar';
import AuthForm from './components/AuthForm';
import ArticleForm from './components/ArticleForm';
import ArticleCard from './components/ArticleCard';

export default function App() {
  // Session restaurée depuis localStorage au chargement
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [articles, setArticles] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Toutes');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
const [loadError, setLoadError] = useState('');
  // À chaque changement de thème : on l'applique sur <html> et on le mémorise
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

useEffect(() => {
  api.get('/articles')
    .then((r) => setArticles(r.data))
    .catch(() => setLoadError('Impossible de contacter le serveur. Réessayez dans un instant.'));
}, []);
  const login = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setShowAuth(false);
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCat('Toutes');
  };
  const addArticle = (a) => setArticles([a, ...articles]);
  const updateArticle = (u) => setArticles(articles.map((a) => (a._id === u._id ? u : a)));
const removeArticle = async (id) => {
  try {
    await api.delete(`/articles/${id}`);
    setArticles(articles.filter((a) => a._id !== id));
  } catch (err) {
    alert(err.response?.data?.message || 'Erreur réseau');
  }
};

  // Filtrage côté client : catégorie + recherche texte
  const visible = articles.filter(
    (a) =>
      (cat === 'Toutes' || (cat === 'Mes articles' ? a.auteur?._id === user?.id : a.categorie === cat)) &&
      (a.titre + ' ' + a.contenu).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar user={user} theme={theme} onToggleTheme={toggleTheme} onLogin={() => setShowAuth(!showAuth)} onLogout={logout} />
      <main>
        <header className="hero">
          <p className="kicker">Édition de l'équipe · {new Date().toLocaleDateString('fr-FR', { dateStyle: 'full' })}</p>
          <h1>Les nouvelles de <em>l'atelier</em></h1>
          <p className="sub">Annonces, victoires et idées de notre PME — écrites par l'équipe, pour l'équipe.</p>
        </header>

        {/* Rendu conditionnel : visiteur vs connecté */}
        {!user && showAuth && <AuthForm onSuccess={login} />}
        {user ? <ArticleForm onCreated={addArticle} /> : !showAuth && (
          <div className="banner">
            <span><strong>Mode lecture</strong> — connectez-vous pour publier et commenter.</span>
            <button className="btn" onClick={() => setShowAuth(true)}>Se connecter</button>
          </div>
        )}

        <div className="section-head">
          <h2>Dernières publications</h2>
          <span className="count">{visible.length} article{visible.length > 1 ? 's' : ''}</span>
        </div>

        <div className="toolbar">
          <input className="search" placeholder="Rechercher un article…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="chips">
            {['Toutes', ...(user ? ['Mes articles'] : []), ...CATEGORIES].map((c) => (
              <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        </div>

        <section className="grid">
          {visible.map((a, i) => (
            <ArticleCard key={a._id} article={a} index={i} user={user} onDelete={removeArticle} onUpdate={updateArticle} />
          ))}
          {loadError && <p className="err">{loadError}</p>}
          {visible.length === 0 && <p className="note">Aucun article trouvé.</p>}
        </section>
      </main>
      <footer>© {new Date().getFullYear()} La Gazette de l'Atelier — projet MERN</footer>
    </>
  );
}
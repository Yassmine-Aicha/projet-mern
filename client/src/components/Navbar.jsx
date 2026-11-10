export default function Navbar({ user, theme, onToggleTheme, onLogin, onLogout }) {
  return (
    <nav className="nav">
      <span className="logo">Atelier<b>.</b></span>
      <div className="nav-r">
        <button className="theme-btn" onClick={onToggleTheme} title="Changer de thème" aria-label="Changer de thème">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        {user ? (
          <>
            <span className="avatar">{user.nom[0]}</span>
            <span><strong>{user.nom}</strong></span>
            {user.role === 'admin' && <span className="badge-admin">Admin</span>}
            <button className="btn ghost" onClick={onLogout}>Déconnexion</button>
          </>
        ) : (
          <button className="btn" onClick={onLogin}>Connexion</button>
        )}
      </div>
    </nav>
  );
}
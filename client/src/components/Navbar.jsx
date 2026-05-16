import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Film, BookmarkCheck, User, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Film size={22} />
        <span>MovieFinder</span>
      </Link>

      <form onSubmit={handleSearch} className="search-form">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Пошук фільмів..."
          className="search-input"
        />
        <button type="submit" className="search-btn"><Search size={16} /></button>
      </form>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/watchlist" className="nav-link"><BookmarkCheck size={18} /></Link>
            <Link to={`/profile/${user.username}`} className="nav-link"><User size={18} /></Link>
            <button onClick={logout} className="nav-link icon-btn"><LogOut size={18} /></button>
          </>
        ) : (
          <Link to="/login" className="nav-link"><LogIn size={18} /> Увійти</Link>
        )}
      </div>
    </nav>
  );
}

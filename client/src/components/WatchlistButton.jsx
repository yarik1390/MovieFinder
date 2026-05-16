import { useState } from 'react';
import { Bookmark, Check, Eye, BookmarkX, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useWatchlist } from '../hooks/useWatchlist.js';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  { value: 'want', label: 'Хочу переглянути', icon: Bookmark },
  { value: 'watching', label: 'Дивлюся', icon: Eye },
  { value: 'watched', label: 'Переглянуто', icon: Check },
];

export default function WatchlistButton({ movie }) {
  const { user } = useAuth();
  const { getStatus, add, update, remove } = useWatchlist();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const status = getStatus(movie.id);
  const current = STATUSES.find(s => s.value === status);

  const handleClick = async (s) => {
    if (!user) return navigate('/login');
    setOpen(false);
    if (status === s.value) {
      await remove(movie.id);
    } else if (status) {
      await update(movie.id, s.value);
    } else {
      await add(movie, s.value);
    }
  };

  return (
    <div className="watchlist-btn-wrapper">
      <button className={`watchlist-btn ${status ? 'active' : ''}`} onClick={() => {
        if (!user) navigate('/login');
        else setOpen(o => !o);
      }}>
        {current ? <current.icon size={16} /> : <Bookmark size={16} />}
        <span>{current ? current.label : 'До списку'}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="watchlist-dropdown">
          {STATUSES.map(s => (
            <button
              key={s.value}
              className={`dropdown-item ${status === s.value ? 'selected' : ''}`}
              onClick={() => handleClick(s)}
            >
              <s.icon size={14} /> {s.label}
            </button>
          ))}
          {status && (
            <button className="dropdown-item danger" onClick={() => { setOpen(false); remove(movie.id); }}>
              <BookmarkX size={14} /> Видалити зі списку
            </button>
          )}
        </div>
      )}
    </div>
  );
}

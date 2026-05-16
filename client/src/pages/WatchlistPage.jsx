import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2 } from 'lucide-react';
import { useWatchlist } from '../hooks/useWatchlist.js';
import { useAuth } from '../hooks/useAuth.jsx';
import ShareButton from '../components/ShareButton.jsx';

const IMG_BASE = 'https://image.tmdb.org/t/p/w185';
const STATUSES = ['want', 'watching', 'watched'];
const LABELS = { want: 'Хочу переглянути', watching: 'Дивлюся', watched: 'Переглянуто' };

export default function WatchlistPage() {
  const { user } = useAuth();
  const { watchlist, update, remove } = useWatchlist();
  const [tab, setTab] = useState('want');

  if (!user) return (
    <main className="page">
      <p className="empty-state">Увійдіть, щоб переглянути список.</p>
    </main>
  );

  const filtered = watchlist.filter(w => w.status === tab);

  return (
    <main className="page">
      <div className="page-header">
        <h1 className="page-title">Мій список</h1>
        <ShareButton type="watchlist" />
      </div>

      <div className="tabs">
        {STATUSES.map(s => (
          <button key={s} className={`tab ${tab === s ? 'active' : ''}`} onClick={() => setTab(s)}>
            {LABELS[s]} ({watchlist.filter(w => w.status === s).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">Список порожній.</p>
      ) : (
        <div className="watchlist-list">
          {filtered.map(item => (
            <div key={item.tmdb_id} className="watchlist-item">
              <Link to={`/movie/${item.tmdb_id}`}>
                {item.poster_path ? (
                  <img src={`${IMG_BASE}${item.poster_path}`} alt={item.title} className="watchlist-poster" />
                ) : (
                  <div className="watchlist-poster no-poster-sm" />
                )}
              </Link>
              <div className="watchlist-item-info">
                <Link to={`/movie/${item.tmdb_id}`} className="watchlist-title">{item.title}</Link>
                <select
                  value={item.status}
                  onChange={e => update(item.tmdb_id, e.target.value)}
                  className="status-select"
                >
                  {STATUSES.map(s => <option key={s} value={s}>{LABELS[s]}</option>)}
                </select>
              </div>
              <button onClick={() => remove(item.tmdb_id)} className="icon-btn danger-icon">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

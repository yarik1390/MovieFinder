import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, User } from 'lucide-react';
import api from '../api/client.js';
import ShareButton from '../components/ShareButton.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const IMG_BASE = 'https://image.tmdb.org/t/p/w185';
const LABELS = { want: 'Хочу переглянути', watching: 'Дивлюся', watched: 'Переглянуто' };

export default function ProfilePage() {
  const { username } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('watchlist');

  useEffect(() => {
    setLoading(true);
    api.get(`/profile/${username}`)
      .then(r => setProfile(r.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="page loading-state">Завантаження...</div>;
  if (!profile) return <div className="page empty-state">Користувача не знайдено.</div>;

  const { user, watchlist, reviews } = profile;
  const isMe = me?.username === username;

  return (
    <main className="page">
      <div className="profile-header">
        <div className="profile-avatar"><User size={40} /></div>
        <div>
          <h1 className="page-title">{user.username}</h1>
          <p className="profile-since">З нами з {new Date(user.created_at).toLocaleDateString('uk-UA')}</p>
        </div>
        {isMe && <ShareButton type="profile" />}
      </div>

      <div className="tabs">
        <button className={`tab ${tab === 'watchlist' ? 'active' : ''}`} onClick={() => setTab('watchlist')}>
          Список ({watchlist.length})
        </button>
        <button className={`tab ${tab === 'reviews' ? 'active' : ''}`} onClick={() => setTab('reviews')}>
          Рецензії ({reviews.length})
        </button>
      </div>

      {tab === 'watchlist' && (
        watchlist.length === 0 ? <p className="empty-state">Список порожній.</p> : (
          <div className="watchlist-list">
            {watchlist.map(item => (
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
                  <span className="status-badge">{LABELS[item.status]}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'reviews' && (
        reviews.length === 0 ? <p className="empty-state">Рецензій ще немає.</p> : (
          <div className="reviews-list">
            {reviews.map(r => (
              <div key={r.tmdb_id} className="review-item">
                <div className="review-header">
                  <Link to={`/movie/${r.tmdb_id}`} className="review-movie-link">Фільм #{r.tmdb_id}</Link>
                  <span className="review-rating"><Star size={13} fill="currentColor" /> {r.rating}/10</span>
                  <span className="review-date">{new Date(r.created_at).toLocaleDateString('uk-UA')}</span>
                </div>
                {r.body && <p className="review-body">{r.body}</p>}
              </div>
            ))}
          </div>
        )
      )}
    </main>
  );
}

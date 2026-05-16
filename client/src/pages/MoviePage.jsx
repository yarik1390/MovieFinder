import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Clock, Calendar } from 'lucide-react';
import { getMovie, getProviders } from '../api/movies.js';
import { getReviews, deleteReview } from '../api/reviews.js';
import WatchlistButton from '../components/WatchlistButton.jsx';
import ProviderList from '../components/ProviderList.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import ShareButton from '../components/ShareButton.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

export default function MoviePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [providers, setProviders] = useState(null);
  const [providerLink, setProviderLink] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = () => getReviews(id).then(setReviews).catch(() => {});

  useEffect(() => {
    setLoading(true);
    Promise.all([getMovie(id), getProviders(id)])
      .then(([m, p]) => {
        setMovie(m);
        setProviders(p.providers);
        setProviderLink(p.link);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    loadReviews();
  }, [id]);

  if (loading) return <div className="page loading-state">Завантаження...</div>;
  if (!movie) return <div className="page empty-state">Фільм не знайдено.</div>;

  const myReview = reviews.find(r => r.user_id === user?.id);

  const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="movie-page">
      {movie.backdrop_path && (
        <div className="backdrop" style={{ backgroundImage: `url(${BACKDROP_BASE}${movie.backdrop_path})` }} />
      )}
      <main className="page movie-detail">
        <div className="movie-detail-layout">
          <div className="movie-poster-col">
            {movie.poster_path && (
              <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} className="detail-poster" />
            )}
          </div>
          <div className="movie-info-col">
            <h1 className="detail-title">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="original-title">{movie.original_title}</p>
            )}
            <div className="detail-meta">
              {movie.vote_average > 0 && (
                <span className="meta-badge rating">
                  <Star size={14} fill="currentColor" /> {movie.vote_average.toFixed(1)}
                </span>
              )}
              {movie.release_date && (
                <span className="meta-badge"><Calendar size={14} /> {movie.release_date.slice(0, 4)}</span>
              )}
              {movie.runtime > 0 && (
                <span className="meta-badge"><Clock size={14} /> {movie.runtime} хв</span>
              )}
              {movie.genres?.map(g => (
                <span key={g.id} className="meta-badge genre">{g.name}</span>
              ))}
            </div>

            {movie.overview && <p className="detail-overview">{movie.overview}</p>}

            <div className="detail-actions">
              <WatchlistButton movie={movie} />
              <ShareButton type="movie" tmdbId={movie.id} />
            </div>

            <section className="detail-section">
              <h3>Де дивитися в Україні</h3>
              <ProviderList providers={providers} link={providerLink} />
            </section>

            {movie.credits?.cast?.length > 0 && (
              <section className="detail-section">
                <h3>У ролях</h3>
                <div className="cast-list">
                  {movie.credits.cast.slice(0, 8).map(a => (
                    <div key={a.id} className="cast-item">
                      {a.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w92${a.profile_path}`} alt={a.name} />
                      ) : (
                        <div className="cast-no-photo" />
                      )}
                      <p className="cast-name">{a.name}</p>
                      <p className="cast-char">{a.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {trailer && (
          <section className="detail-section trailer-section">
            <h3>Трейлер</h3>
            <div className="trailer-wrapper">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                allowFullScreen
                title="Trailer"
              />
            </div>
          </section>
        )}

        <section className="detail-section reviews-section">
          <h3>Рецензії</h3>
          {user && (
            <div className="my-review">
              <h4>{myReview ? 'Ваша рецензія' : 'Написати рецензію'}</h4>
              <ReviewForm tmdbId={parseInt(id)} existing={myReview} onSaved={loadReviews} />
              {myReview && (
                <button className="btn-danger" onClick={() => deleteReview(id).then(loadReviews)}>
                  Видалити рецензію
                </button>
              )}
            </div>
          )}
          <div className="reviews-list">
            {reviews.length === 0 && <p className="empty-state">Рецензій ще немає.</p>}
            {reviews.map(r => (
              <div key={r.id} className="review-item">
                <div className="review-header">
                  <strong>{r.username}</strong>
                  <span className="review-rating"><Star size={13} fill="currentColor" /> {r.rating}/10</span>
                  <span className="review-date">{new Date(r.created_at).toLocaleDateString('uk-UA')}</span>
                </div>
                {r.body && <p className="review-body">{r.body}</p>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

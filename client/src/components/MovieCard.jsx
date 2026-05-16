import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const IMG_BASE = 'https://image.tmdb.org/t/p/w342';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      {movie.poster_path ? (
        <img src={`${IMG_BASE}${movie.poster_path}`} alt={movie.title} loading="lazy" />
      ) : (
        <div className="no-poster">Немає постера</div>
      )}
      <div className="movie-card-info">
        <p className="movie-card-title">{movie.title}</p>
        <div className="movie-card-meta">
          <span className="rating"><Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1)}</span>
          <span>{movie.release_date?.slice(0, 4)}</span>
        </div>
      </div>
    </Link>
  );
}

import { useEffect, useState } from 'react';
import { getTrending } from '../api/movies.js';
import MovieCard from '../components/MovieCard.jsx';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then(data => setMovies(data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <h1 className="page-title">Популярні фільми цього тижня</h1>
      {loading ? (
        <div className="grid-skeleton">
          {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map(m => <MovieCard key={m.id} movie={m} />)}
        </div>
      )}
    </main>
  );
}

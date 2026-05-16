import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/movies.js';
import MovieCard from '../components/MovieCard.jsx';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    searchMovies(q, page)
      .then(data => {
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [q, page]);

  useEffect(() => setPage(1), [q]);

  return (
    <main className="page">
      <h1 className="page-title">Результати пошуку: «{q}»</h1>
      {loading ? (
        <div className="grid-skeleton">
          {Array(12).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : movies.length === 0 ? (
        <p className="empty-state">Нічого не знайдено.</p>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map(m => <MovieCard key={m.id} movie={m} />)}
          </div>
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary">←</button>
            <span>{page} / {Math.min(totalPages, 500)}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary">→</button>
          </div>
        </>
      )}
    </main>
  );
}

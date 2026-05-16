import { useState } from 'react';
import { Star } from 'lucide-react';
import { submitReview } from '../api/reviews.js';

export default function ReviewForm({ tmdbId, existing, onSaved }) {
  const [rating, setRating] = useState(existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState(existing?.body || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError('Поставте оцінку');
    setLoading(true);
    setError('');
    try {
      await submitReview({ tmdb_id: tmdbId, rating, body });
      onSaved?.();
    } catch {
      setError('Помилка збереження');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <div className="star-rating">
        {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
          <button
            key={n}
            type="button"
            className={`star ${n <= (hover || rating) ? 'active' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            <Star size={20} fill={n <= (hover || rating) ? 'currentColor' : 'none'} />
          </button>
        ))}
        {rating > 0 && <span className="rating-label">{rating}/10</span>}
      </div>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder="Ваша рецензія (необов'язково)..."
        className="review-textarea"
        rows={3}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Збереження...' : 'Зберегти рецензію'}
      </button>
    </form>
  );
}

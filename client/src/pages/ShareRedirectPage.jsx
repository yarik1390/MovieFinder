import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resolveShareLink } from '../api/share.js';

export default function ShareRedirectPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    resolveShareLink(code)
      .then(link => {
        if (link.type === 'movie') {
          navigate(`/movie/${link.tmdb_id}`, { replace: true });
        } else if (link.type === 'watchlist' || link.type === 'profile') {
          navigate(`/profile/${link.username}`, { replace: true });
        } else {
          setError('Невідомий тип посилання');
        }
      })
      .catch(() => setError('Посилання не знайдено або застаріло.'));
  }, [code]);

  if (error) return <div className="page empty-state">{error}</div>;
  return <div className="page loading-state">Перенаправлення...</div>;
}

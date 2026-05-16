import { useState, useEffect } from 'react';
import { getWatchlist, addToWatchlist, updateStatus, removeFromWatchlist } from '../api/watchlist.js';
import { useAuth } from './useAuth.jsx';

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      getWatchlist().then(setWatchlist).catch(() => {});
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const getStatus = (tmdbId) => {
    const item = watchlist.find(w => w.tmdb_id === tmdbId);
    return item?.status || null;
  };

  const add = async (movie, status = 'want') => {
    await addToWatchlist({
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      status,
    });
    setWatchlist(prev => [...prev, { tmdb_id: movie.id, title: movie.title, poster_path: movie.poster_path, status }]);
  };

  const update = async (tmdbId, status) => {
    await updateStatus(tmdbId, status);
    setWatchlist(prev => prev.map(w => w.tmdb_id === tmdbId ? { ...w, status } : w));
  };

  const remove = async (tmdbId) => {
    await removeFromWatchlist(tmdbId);
    setWatchlist(prev => prev.filter(w => w.tmdb_id !== tmdbId));
  };

  return { watchlist, getStatus, add, update, remove };
}

import api from './client.js';

export const getWatchlist = () => api.get('/watchlist').then(r => r.data);
export const addToWatchlist = (data) => api.post('/watchlist', data).then(r => r.data);
export const updateStatus = (tmdbId, status) => api.put(`/watchlist/${tmdbId}`, { status }).then(r => r.data);
export const removeFromWatchlist = (tmdbId) => api.delete(`/watchlist/${tmdbId}`).then(r => r.data);

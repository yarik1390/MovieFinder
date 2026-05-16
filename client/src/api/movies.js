import api from './client.js';

export const getTrending = () => api.get('/movies/trending').then(r => r.data);
export const searchMovies = (q, page = 1) => api.get('/movies/search', { params: { q, page } }).then(r => r.data);
export const getMovie = (id) => api.get(`/movies/${id}`).then(r => r.data);
export const getProviders = (id) => api.get(`/movies/${id}/providers`).then(r => r.data);

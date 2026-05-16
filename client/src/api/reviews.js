import api from './client.js';

export const getReviews = (tmdbId) => api.get(`/reviews/movie/${tmdbId}`).then(r => r.data);
export const submitReview = (data) => api.post('/reviews', data).then(r => r.data);
export const deleteReview = (tmdbId) => api.delete(`/reviews/${tmdbId}`).then(r => r.data);

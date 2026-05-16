import api from './client.js';

export const createShareLink = (data) => api.post('/share', data).then(r => r.data);
export const resolveShareLink = (code) => api.get(`/share/${code}`).then(r => r.data);

import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res) => {
  const items = db.prepare(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC'
  ).all(req.user.id);
  res.json(items);
});

router.post('/', (req, res) => {
  const { tmdb_id, title, poster_path, status = 'want' } = req.body;
  if (!tmdb_id || !title) return res.status(400).json({ error: 'tmdb_id and title required' });
  try {
    const stmt = db.prepare(
      'INSERT INTO watchlist (user_id, tmdb_id, title, poster_path, status) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(req.user.id, tmdb_id, title, poster_path || null, status);
    res.json({ success: true });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Already in watchlist' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:tmdbId', (req, res) => {
  const { status } = req.body;
  if (!['want', 'watching', 'watched'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const result = db.prepare(
    'UPDATE watchlist SET status = ? WHERE user_id = ? AND tmdb_id = ?'
  ).run(status, req.user.id, parseInt(req.params.tmdbId));
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

router.delete('/:tmdbId', (req, res) => {
  const result = db.prepare(
    'DELETE FROM watchlist WHERE user_id = ? AND tmdb_id = ?'
  ).run(req.user.id, parseInt(req.params.tmdbId));
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

export default router;

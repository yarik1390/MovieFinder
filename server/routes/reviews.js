import { Router } from 'express';
import db from '../db/index.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/movie/:tmdbId', optionalAuth, (req, res) => {
  const reviews = db.prepare(`
    SELECT r.id, r.rating, r.body, r.created_at,
           u.username, u.id as user_id
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.tmdb_id = ?
    ORDER BY r.created_at DESC
  `).all(parseInt(req.params.tmdbId));
  res.json(reviews);
});

router.post('/', requireAuth, (req, res) => {
  const { tmdb_id, rating, body } = req.body;
  if (!tmdb_id || !rating) return res.status(400).json({ error: 'tmdb_id and rating required' });
  if (rating < 1 || rating > 10) return res.status(400).json({ error: 'Rating must be 1-10' });
  try {
    db.prepare(`
      INSERT INTO reviews (user_id, tmdb_id, rating, body)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, tmdb_id) DO UPDATE SET rating = excluded.rating, body = excluded.body, created_at = CURRENT_TIMESTAMP
    `).run(req.user.id, tmdb_id, rating, body || null);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:tmdbId', requireAuth, (req, res) => {
  const result = db.prepare(
    'DELETE FROM reviews WHERE user_id = ? AND tmdb_id = ?'
  ).run(req.user.id, parseInt(req.params.tmdbId));
  if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
});

export default router;

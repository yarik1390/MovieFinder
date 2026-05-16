import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

router.get('/:username', (req, res) => {
  const user = db.prepare('SELECT id, username, created_at FROM users WHERE username = ?').get(req.params.username);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const watchlist = db.prepare(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC'
  ).all(user.id);

  const reviews = db.prepare(`
    SELECT r.tmdb_id, r.rating, r.body, r.created_at
    FROM reviews r
    WHERE r.user_id = ?
    ORDER BY r.created_at DESC
  `).all(user.id);

  res.json({ user, watchlist, reviews });
});

export default router;

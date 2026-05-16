import { Router } from 'express';
import { nanoid } from 'nanoid';
import db from '../db/index.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', requireAuth, (req, res) => {
  const { type, tmdb_id } = req.body;
  if (!['watchlist', 'movie', 'profile'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }
  if (type === 'movie' && !tmdb_id) {
    return res.status(400).json({ error: 'tmdb_id required for movie share' });
  }

  const code = nanoid(6);
  db.prepare(
    'INSERT INTO share_links (code, type, user_id, tmdb_id) VALUES (?, ?, ?, ?)'
  ).run(code, type, req.user.id, tmdb_id || null);

  const host = `${req.protocol}://${req.get('host')}`;
  res.json({ code, url: `${host}/s/${code}` });
});

router.get('/:code', (req, res) => {
  const link = db.prepare(`
    SELECT sl.*, u.username
    FROM share_links sl
    JOIN users u ON sl.user_id = u.id
    WHERE sl.code = ?
  `).get(req.params.code);

  if (!link) return res.status(404).json({ error: 'Share link not found' });
  res.json(link);
});

export default router;

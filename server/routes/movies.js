import { Router } from 'express';

const router = Router();
const TMDB_BASE = 'https://api.themoviedb.org/3';

async function tmdb(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', process.env.TMDB_API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB error ${res.status}`);
  return res.json();
}

router.get('/trending', async (req, res) => {
  try {
    const data = await tmdb('/trending/movie/week', { region: 'UA', language: 'uk-UA' });
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Failed to fetch trending movies' });
  }
});

router.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });
  try {
    const data = await tmdb('/search/movie', { query: q, page, language: 'uk-UA', region: 'UA' });
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Failed to search movies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await tmdb(`/movie/${req.params.id}`, {
      language: 'uk-UA',
      append_to_response: 'credits,videos',
    });
    res.json(data);
  } catch {
    res.status(502).json({ error: 'Failed to fetch movie' });
  }
});

router.get('/:id/providers', async (req, res) => {
  try {
    const data = await tmdb(`/movie/${req.params.id}/watch/providers`);
    const providers = data.results?.UA || null;
    res.json({ providers, link: providers?.link || null });
  } catch {
    res.status(502).json({ error: 'Failed to fetch providers' });
  }
});

export default router;

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env') });
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import moviesRoutes from './routes/movies.js';
import watchlistRoutes from './routes/watchlist.js';
import reviewsRoutes from './routes/reviews.js';
import shareRoutes from './routes/share.js';
import profileRoutes from './routes/profile.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/profile', profileRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

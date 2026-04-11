require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const auth     = require('./middleware/auth');

if (!process.env.MONGO_URL) {
  console.error('FATAL: MONGO_URL missing in .env');
  process.exit(1);
}
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'change-me-to-a-long-random-string') {
  console.warn('WARNING: JWT_SECRET is unset or using the placeholder value. Set a real secret in .env.');
}

mongoose.set('bufferCommands', false); // fail fast instead of hanging queries forever

mongoose
  .connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 8000 })
  .then(() => console.log('✓ MongoDB connected'))
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    process.exit(1);
  });

mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err.message));

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, mongo: mongoose.connection.readyState === 1 }),
);

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/seizures', auth, require('./routes/seizures'));
app.use('/api/keto',     auth, require('./routes/keto'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));

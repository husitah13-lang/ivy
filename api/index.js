import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// --- BARE BONES MODEL ---
const contentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

const app = express();
app.use(cors());
app.use(express.json());

// --- HEALTH CHECK ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bare bones API is working' });
});

app.get('/api/login-test', (req, res) => {
  res.json({ message: 'Login endpoint is reachable' });
});

// --- DB CONNECTION ---
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  return await mongoose.connect(process.env.MONGO_URI);
}

app.get('/api/collections', async (req, res) => {
  try {
    await connectToDatabase();
    const collections = await Content.find({}, 'name');
    res.json(collections.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;

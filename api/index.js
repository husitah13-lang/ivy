import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// --- DATABASE MODEL ---
const contentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  lastUpdated: { type: Date, default: Date.now }
});
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- DB CONNECTION ---
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  return await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
  });
}

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  const SECRET_KEY = process.env.JWT_SECRET || 'z8fNp9mK4/vL3qZ1A5B7C9D0E2F4G6H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4';
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- ROUTES ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stable Core is active' });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'ivyadmin123') {
    const SECRET_KEY = process.env.JWT_SECRET || 'z8fNp9mK4/vL3qZ1A5B7C9D0E2F4G6H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4';
    const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    return res.json({ token });
  } 
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/collections', async (req, res) => {
  try {
    await connectToDatabase();
    const collections = await Content.find({}, 'name').sort({ name: 1 });
    res.json(collections.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/content/:collection', async (req, res) => {
  try {
    await connectToDatabase();
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generic route to match frontend
app.get('/api/:collection', async (req, res) => {
  try {
    await connectToDatabase();
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/content/:collection', authenticateToken, async (req, res) => {
  try {
    await connectToDatabase();
    await Content.findOneAndUpdate(
      { name: req.params.collection },
      { name: req.params.collection, data: req.body, lastUpdated: new Date() },
      { upsert: true }
    );
    res.json({ success: true, message: 'Saved to Cloud DB!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', (req, res) => {
  res.status(501).json({ error: 'Uploads are temporarily disabled for stability. Coming soon!' });
});

export default app;

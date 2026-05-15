const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') }); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const nodemailer = require('nodemailer');
const Content = require('./models/Content');

const app = express();
const PORT = process.env.PORT || 5021;
const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-ivy-key';

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/debug-env', (req, res) => {
  res.json({
    has_mongo_uri: !!process.env.MONGO_URI,
    has_cloudinary_name: !!process.env.CLOUDINARY_CLOUD_NAME,
    has_cloudinary_key: !!process.env.CLOUDINARY_API_KEY,
    has_cloudinary_secret: !!process.env.CLOUDINARY_API_SECRET,
    env_loaded_from_root: fs.existsSync(path.join(__dirname, '../.env')),
    env_loaded_from_local: fs.existsSync(path.join(__dirname, '.env')),
    node_env: process.env.NODE_ENV || 'not set',
    port: PORT
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Ivy Cloud CMS is Running</h1><p>Visit your production URL to manage content.</p>');
});

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT Verification failed:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// --- Routes ---

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // In production, you'd check this against a User model.
  // For now, keeping your existing logic.
  if (username === 'admin' && password === 'ivyadmin123') {
    const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/sitemap.xml', async (req, res) => {
  try {
    const collections = await Content.find(
      { name: { $nin: ['index', 'index.ar', 'articleContent', 'articleContent.ar'] } }, 
      'name lastUpdated'
    );

    const baseUrl = 'https://your-domain.com';
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    const staticRoutes = [
      { path: '/', priority: '1.0' },
      { path: '/services', priority: '0.8' },
      { path: '/what-we-think', priority: '0.8' },
      { path: '/careers', priority: '0.6' },
      { path: '/contact', priority: '0.6' }
    ];

    staticRoutes.forEach(route => {
      xml += `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <lastmod>${new Date().toISOString()}</lastmod>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    });
    
    collections.forEach(item => {
      const path = item.name.includes('service') ? `/services/${item.name}` : `/what-we-think/${item.name}`;
      const date = item.lastUpdated ? new Date(item.lastUpdated).toISOString() : new Date().toISOString();
      xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n    <lastmod>${date}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    });
    
    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/api/collections', async (req, res) => {
  try {
    const collections = await Content.find({}, 'name').sort({ name: 1 });
    res.json(collections.map(c => c.name));
  } catch (err) {
    res.status(500).json({ error: 'Error reading collections' });
  }
});

// Both /api/content/:collection and /api/:collection should work
app.get('/api/content/:collection', async (req, res) => {
  try {
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content' });
  }
});

app.get('/api/:collection', async (req, res) => {
  try {
    const content = await Content.findOne({ name: req.params.collection });
    if (!content) return res.status(404).json({ error: 'Collection not found' });
    res.json(content.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching content' });
  }
});

app.post('/api/content/:collection', authenticateToken, async (req, res) => {
  try {
    await Content.findOneAndUpdate(
      { name: req.params.collection },
      { name: req.params.collection, data: req.body, lastUpdated: new Date() },
      { upsert: true }
    );
    res.json({ success: true, message: 'Content saved to Cloud DB!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving data' });
  }
});

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image Upload (Cloudinary Storage)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ivy_interactive',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  },
});
const upload = multer({ storage: storage });


app.post('/api/upload', authenticateToken, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Cloudinary Upload Error:', err);
      return res.status(500).json({ 
        error: 'Image upload failed', 
        details: err.message || 'Unknown server error'
      });
    }
    
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Multer-storage-cloudinary provides the secure_url in path or url
    res.json({ url: req.file.path || req.file.secure_url });
  });
});

app.post('/api/translate', authenticateToken, async (req, res) => {
  const { text, target_lang } = req.body;
  const DEEPL_KEY = 'e710c1c0-b075-4a6f-979b-654773e77869:fx';

  if (!text) return res.status(400).json({ error: 'Text is required' });

  let attempts = 0;
  const maxAttempts = 3;

  const tryTranslate = async () => {
    try {
      console.log(`DeepL Translating: "${text.substring(0, 50)}..."`);
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          text: text,
          target_lang: target_lang || 'AR'
        })
      });

      if (response.status === 429 && attempts < maxAttempts) {
        attempts++;
        console.log(`DeepL rate limit hit. Retry attempt ${attempts}...`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        return tryTranslate();
      }

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      res.json({ translatedText: data.translations[0].text });
    } catch (err) {
      console.error("Server translation error:", err);
      res.status(500).json({ error: 'Translation failed' });
    }
  };

  await tryTranslate();
});

// --- Contact Form Mailer ---
app.post('/api/contact-submit', async (req, res) => {
  const { inquiryType, firstName, lastName, email, phone, company, role, country, message, destinationEmail } = req.body;

  // We fall back to ethereal email (a fake SMTP service) if real SMTP is not configured in .env
  // For production, you should set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
  try {
    let transporter;
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Create a test account for local development if no SMTP is provided
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Using Ethereal Mail for testing.');
    }

    const mailOptions = {
      from: `"IVY Contact Form" <${process.env.SMTP_USER || 'no-reply@ivyinteractive.co'}>`,
      to: destinationEmail || process.env.CONTACT_RECIPIENT_EMAIL || "mhussain200004@gmail.com",
      subject: `New Contact Inquiry: ${inquiryType} from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Country:</strong> ${country}</p>
        <h3>Message:</h3>
        <p>${message}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    
    // Log URL if using Ethereal
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Cloud CMS Backend running on http://localhost:${PORT}`);
});

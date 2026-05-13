const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// MongoDB URI from .env
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI not found in .env file');
  process.exit(1);
}

// Define the Schema (matching your models/Content.js)
const contentSchema = new mongoose.Schema({
  name: String,
  data: mongoose.Schema.Types.Mixed,
  lastUpdated: Date
});

const Content = mongoose.model('Content', contentSchema);

async function exportDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    const exportDir = path.join(process.cwd(), 'database_export');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
      console.log(`Created directory: ${exportDir}`);
    }

    console.log('Fetching collections...');
    const allContent = await Content.find({});
    console.log(`Found ${allContent.length} collections to export.`);

    for (const doc of allContent) {
      const fileName = `${doc.name}.json`;
      const filePath = path.join(exportDir, fileName);
      
      // Ensure data is stringified with nice formatting
      const jsonContent = JSON.stringify(doc.data, null, 2);
      
      fs.writeFileSync(filePath, jsonContent);
      console.log(`Exported: ${fileName}`);
    }

    console.log('\n--- SUCCESS ---');
    console.log(`Total exported: ${allContent.length} files`);
    console.log(`Location: ${exportDir}`);

  } catch (err) {
    console.error('Export failed:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
}

exportDatabase();

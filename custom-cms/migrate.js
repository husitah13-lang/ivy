require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const Content = require('./models/Content');

const dataDir = path.join(__dirname, 'data');

async function migrate() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} JSON files. Starting migration...`);

    for (const file of jsonFiles) {
      const name = file.replace('.json', '');
      const filePath = path.join(dataDir, file);
      const dataStr = await fs.readFile(filePath, 'utf8');
      
      let data;
      try {
        data = JSON.parse(dataStr);
      } catch (e) {
        console.error(`Error parsing ${file}:`, e.message);
        continue;
      }

      await Content.findOneAndUpdate(
        { name },
        { name, data, lastUpdated: new Date() },
        { upsert: true, new: true }
      );
      
      console.log(`Migrated: ${name}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();

require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const fetch = require('node-fetch'); // I might need to install this or use built-in if on node 18+

const DEEPL_KEY = 'e710c1c0-b075-4a6f-979b-654773e77869:fx';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateText(text, targetLang = 'AR', attempts = 0) {
  if (!text || typeof text !== 'string' || text.length < 2 || text.includes('http')) return text;
  
  try {
    await sleep(300); // Increased baseline delay
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang
      })
    });

    if (response.status === 429 && attempts < 5) {
      console.log(`Rate limit hit. Waiting 2 seconds (Attempt ${attempts + 1})...`);
      await sleep(2000);
      return translateText(text, targetLang, attempts + 1);
    }

    if (!response.ok) {
      console.error(`DeepL Error: ${response.status}`);
      return text;
    }

    const data = await response.json();
    return data.translations[0].text;
  } catch (err) {
    console.error("Translation error:", err);
    return text;
  }
}

async function translateObject(obj) {
  if (typeof obj === 'string') {
    return await translateText(obj);
  }

  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item));
    }
    return translatedArray;
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      const lowerKey = key.toLowerCase();
      if (
        key === 'id' || 
        lowerKey.includes('link') || 
        lowerKey.includes('href') || 
        lowerKey.includes('image') || 
        lowerKey.includes('src') || 
        lowerKey.includes('path') || 
        lowerKey.includes('url') ||
        key.startsWith('_')
      ) {
        newObj[key] = obj[key];
      } else {
        newObj[key] = await translateObject(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const collections = await Content.find({ name: { $not: /\.ar$/ } });
  console.log(`Found ${collections.length} English collections to translate.`);

  for (const collection of collections) {
    console.log(`Translating collection: ${collection.name}...`);
    const translatedData = await translateObject(collection.data);
    
    const arName = `${collection.name}.ar`;
    await Content.findOneAndUpdate(
      { name: arName },
      { name: arName, data: translatedData, lastUpdated: new Date() },
      { upsert: true }
    );
    console.log(`Saved Arabic version for ${collection.name}`);
  }

  console.log('Bulk translation complete!');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

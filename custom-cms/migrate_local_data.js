require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

async function syncCollection(name, data) {
    console.log(`Syncing collection: ${name}...`);
    await Content.findOneAndUpdate(
        { name: name },
        { name: name, data: data, lastUpdated: new Date() },
        { upsert: true }
    );
    console.log(`Synced ${name}`);
}

function readJsObject(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove all export statements and keep only the object/array
    content = content.replace(/export\s+(default|const\s+\w+|let\s+\w+|var\s+\w+)\s*=\s*/g, '');
    content = content.replace(/export\s+default\s+/g, '');
    
    // Remove trailing semicolons and whitespace
    content = content.trim();
    if (content.endsWith(';')) content = content.slice(0, -1);
    
    try {
        // If it's a JSON-like object starting with { or [, wrap in parens and eval
        if (content.startsWith('{') || content.startsWith('[')) {
            return eval('(' + content + ')');
        }
        return null;
    } catch (e) {
        console.error(`Failed to parse ${filePath}:`, e.message);
        // Debug: show the first 100 chars of what we tried to parse
        console.log('Snippet:', content.substring(0, 100));
        return null;
    }
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const pairs = [
        { en: 'src/data/content/homepage.js', ar: 'src/data/content/homepage.ar.js', name: 'homepage' },
        { en: 'src/data/content/services_main.js', ar: 'src/data/content/services_main_ar.js', name: 'services_main' },
        { en: 'src/data/insights.json', ar: 'src/data/insights.ar.json', name: 'insights' },
        { en: 'src/data/articleContent.json', ar: 'src/data/articleContent.ar.json', name: 'articleContent' },
        { en: 'src/data/ecommerce.js', ar: 'src/data/ecommerce.ar.js', name: 'ecommerce' },
        { en: 'src/data/ai-solutions.js', ar: 'src/data/ai-solutions.ar.js', name: 'ai-solutions' },
        { en: 'src/data/app-development.js', ar: 'src/data/app-development.ar.js', name: 'app-development' },
        { en: 'src/data/branding-and-design.js', ar: 'src/data/branding-and-design.ar.js', name: 'branding-and-design' },
        { en: 'src/data/marketing-services.js', ar: 'src/data/marketing-services.ar.js', name: 'marketing-services' },
        { en: 'src/data/web-development.js', ar: 'src/data/web-development.ar.js', name: 'web-development' },
        { en: 'src/data/targets.js', ar: 'src/data/targets.ar.js', name: 'targets' }
    ];

    for (const pair of pairs) {
        const enPath = path.join(root, pair.en);
        const arPath = path.join(root, pair.ar);

        if (fs.existsSync(enPath)) {
            const data = enPath.endsWith('.json') ? JSON.parse(fs.readFileSync(enPath, 'utf8')) : readJsObject(enPath);
            if (data) await syncCollection(pair.name, data);
        }

        if (fs.existsSync(arPath)) {
            const data = arPath.endsWith('.json') ? JSON.parse(fs.readFileSync(arPath, 'utf8')) : readJsObject(arPath);
            if (data) await syncCollection(`${pair.name}.ar`, data);
        }
    }

    console.log('Full Database Sync Complete!');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});

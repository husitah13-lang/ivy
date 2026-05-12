const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const DEEPL_KEY = 'e710c1c0-b075-4a6f-979b-654773e77869:fx';

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateText(text, targetLang = 'AR') {
    if (!text || typeof text !== 'string' || text.length < 2 || text.includes('http')) return text;
    
    try {
        await sleep(300);
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
        const result = [];
        for (const item of obj) {
            result.push(await translateObject(item));
        }
        return result;
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

async function fixFile(sourcePath, targetPath) {
    console.log(`Fixing: ${sourcePath} -> ${targetPath}`);
    const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
    const translatedData = await translateObject(sourceData);
    fs.writeFileSync(targetPath, JSON.stringify(translatedData, null, 2), 'utf8');
    console.log(`Done: ${targetPath}`);
}

async function run() {
    const root = path.join(__dirname, '..');
    
    // 1. Fix insights
    await fixFile(
        path.join(root, 'src', 'data', 'insights.json'),
        path.join(root, 'src', 'data', 'insights.ar.json')
    );
    
    // 2. Fix articleContent
    await fixFile(
        path.join(root, 'src', 'data', 'articleContent.json'),
        path.join(root, 'src', 'data', 'articleContent.ar.json')
    );
    
    console.log('All translations fixed and saved with UTF-8 encoding!');
}

run().catch(console.error);

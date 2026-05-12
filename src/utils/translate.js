const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Utility to recursively translate all strings in a JSON object
 * Now calls our local backend (port 3001) to bypass DeepL CORS issues.
 */
export async function translateObject(obj, targetLang = 'ar') {
  const token = localStorage.getItem('adminToken');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  if (typeof obj === 'string') {
    if (!obj.trim() || obj.length < 2 || obj.includes('http')) return obj;
    
    console.log(`Translating: "${obj.substring(0, 30)}..." to ${targetLang} [Engine: DeepL (Server-side)]`);

    try {
      // Add a 500ms delay to avoid DeepL rate limits (429)
      await sleep(500);

      // --- Secure: Call our local backend ---
      const res = await fetch(`${baseUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: obj,
          target_lang: 'AR'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const result = data.translatedText;
        console.log("Translation Result:", result);
        return result || obj;
      } else {
        const errorData = await res.json();
        console.error("Backend Translation Error:", errorData);
      }

      // --- Fallback: MyMemory API ---
      console.log("Using MyMemory Fallback...");
      await sleep(300);
      const mRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(obj)}&langpair=en|${targetLang}&de=admin@ivy-digital.com`);
      const mData = await mRes.json();
      const translated = mData.responseData.translatedText;
      
      if (translated && (translated.includes('MYMEMORY WARNING') || translated.includes('PLEASE LOGIN'))) {
        return obj;
      }
      return translated || obj;

    } catch (err) {
      console.error("Translation logic error:", err);
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    const translatedArray = [];
    for (const item of obj) {
      translatedArray.push(await translateObject(item, targetLang));
    }
    return translatedArray;
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      const lowerKey = key.toLowerCase();
      // Don't translate IDs, links, paths, image sources, or CMS metadata
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
        newObj[key] = await translateObject(obj[key], targetLang);
      }
    }
    return newObj;
  }

  return obj;
}
/**
 * Recursively translates only the differences between newData and oldData,
 * merging them into existingTargetData.
 */
export async function translateDiff(newData, oldData, existingTargetData, targetLang = 'ar') {
  // 1. Handle Strings (The actual content)
  if (typeof newData === 'string') {
    // If it's a short string, a link, or empty, don't translate (re-use translateObject logic)
    if (!newData.trim() || newData.length < 2 || newData.includes('http')) return newData;

    // If it's the same as the old baseline, keep the existing translation
    if (newData === oldData && existingTargetData !== undefined && existingTargetData !== null) {
      return existingTargetData;
    }

    // Otherwise, translate the new value
    return await translateObject(newData, targetLang);
  }

  // 2. Handle Arrays
  if (Array.isArray(newData)) {
    const result = [];
    const oldArr = Array.isArray(oldData) ? oldData : [];
    const targetArr = Array.isArray(existingTargetData) ? existingTargetData : [];

    for (let i = 0; i < newData.length; i++) {
      result.push(await translateDiff(newData[i], oldArr[i], targetArr[i], targetLang));
    }
    return result;
  }

  // 3. Handle Objects
  if (typeof newData === 'object' && newData !== null) {
    const result = { ...(existingTargetData || {}) };
    const oldObj = (typeof oldData === 'object' && oldData !== null) ? oldData : {};
    const targetObj = (typeof existingTargetData === 'object' && existingTargetData !== null) ? existingTargetData : {};

    for (const key in newData) {
      const lowerKey = key.toLowerCase();
      // Skip translation for excluded keys
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
        result[key] = newData[key];
      } else {
        result[key] = await translateDiff(newData[key], oldObj[key], targetObj[key], targetLang);
      }
    }
    return result;
  }

  return newData;
}

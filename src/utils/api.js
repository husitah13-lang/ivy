const cache = new Map();

/**
 * Get cached data instantly without waiting for network
 */
export function getCachedData(path, urlParamsObject = {}) {
  const queryString = new URLSearchParams(urlParamsObject).toString();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ''}`;
  const cacheKey = `ivy_cache_${requestUrl}`;
  
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  
  const stored = sessionStorage.getItem(cacheKey);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      cache.set(cacheKey, data);
      return data;
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Optimized API utility with ultra-fast caching (SWR Pattern)
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const method = options.method || 'GET';
  const queryString = new URLSearchParams(urlParamsObject).toString();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ''}`;
  const cacheKey = `ivy_cache_${requestUrl}`;
  
  // Clear any existing cache on write requests
  if (method !== 'GET') {
    cache.clear();
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('ivy_cache_')) sessionStorage.removeItem(key);
    });
  }

  // SWR Pattern: If GET request and we have cache, return instantly, revalidate in background
  if (method === 'GET') {
    const cachedData = getCachedData(path, urlParamsObject);
    if (cachedData) {
      // Fire background revalidation without awaiting
      revalidate(requestUrl, options, cacheKey).catch(console.error);
      return cachedData;
    }
  }

  return await revalidate(requestUrl, options, cacheKey);
}

async function revalidate(url, options, cacheKey) {
  try {
    const mergedOptions = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    };

    const response = await fetch(url, mergedOptions);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    
    // Update caches
    cache.set(cacheKey, data);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
      sessionStorage.clear();
    }
    
    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    return cache.get(cacheKey) || JSON.parse(sessionStorage.getItem(cacheKey) || 'null');
  }
}

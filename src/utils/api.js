const cache = new Map();

/**
 * Optimized API utility with ultra-fast caching (SWR Pattern)
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  const method = options.method || 'GET';
  const queryString = new URLSearchParams(urlParamsObject).toString();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ''}`;
  
  // Clear any existing cache on write requests
  if (method !== 'GET') {
    cache.clear();
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('ivy_cache_')) sessionStorage.removeItem(key);
    });
  }

  // Always fetch fresh data to ensure immediate updates across all tabs and languages
  return await revalidate(requestUrl, options, `ivy_cache_${requestUrl}`);
}

async function revalidate(url, options, cacheKey) {
  try {
    const mergedOptions = {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
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
      // Handle quota exceeded
      sessionStorage.clear();
    }
    
    return data;
  } catch (error) {
    console.error('Fetch API Error:', error);
    return cache.get(cacheKey) || null;
  }
}

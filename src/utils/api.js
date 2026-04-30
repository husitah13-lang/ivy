/**
 * Simplified API utility for Custom CMS
 * @param {string} path - The API path (e.g. '/homepage')
 * @param {object} urlParamsObject - Additional query parameters
 * @param {object} options - Fetch options
 * @returns {Promise<any>}
 */
export async function fetchAPI(path, urlParamsObject = {}, options = {}) {
  try {
    const mergedOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const queryString = new URLSearchParams(urlParamsObject).toString();
    const baseUrl = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '');
    const requestUrl = `${baseUrl}/api${path}${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(requestUrl, mergedOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Fetch API Error:', error);
    return null;
  }
}

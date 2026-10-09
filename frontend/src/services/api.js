/**
 * Centralized API Client
 * Manages request headers, authentication tokens, and standardized JSON parsing.
 */

export const getAuthToken = () => {
  return (
    sessionStorage.getItem('livefix_token') ||
    localStorage.getItem('livefix_token') ||
    localStorage.getItem('fixconnect_token') ||
    localStorage.getItem('token') ||
    ''
  );
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
      return { success: false, error: errorMsg, status: res.status, data };
    }

    return { success: true, ...data };
  } catch (err) {
    console.error(`API request error on ${url}:`, err);
    return {
      success: false,
      error: 'Network connection failure. Please check your internet or server status.'
    };
  }
}

export const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001'
    : process.env.REACT_APP_API_URL || '';

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, { ...options });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const adminHeaders = () => {
  const token    = localStorage.getItem('token');
  const adminKey = localStorage.getItem('adminKey');
  return {
    'Content-Type':  'application/json',
    ...(token    && { Authorization: `Bearer ${token}` }),
    ...(adminKey && { 'x-admin-key': adminKey }),
  };
};

export const adminFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: adminHeaders(),
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

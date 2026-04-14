const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL;

export const apiFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
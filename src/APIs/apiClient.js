export const apiFetch = (url, options = {}, accessToken) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return fetch(url, {
    ...options,
    headers,
    mode: 'cors',
  });
};

export default apiFetch;

import { API_BASE_URL } from './config';

const readError = async (response) => {
  const text = await response.text().catch(() => '');
  try {
    const json = JSON.parse(text);
    return json.message || json.title || text;
  } catch {
    return text || `HTTP error! status: ${response.status}`;
  }
};

const toUser = (data) => ({
  id: data.userId,
  email: data.email,
  role: data.role?.toLowerCase(),
  accessToken: data.token,
  expiresAt: data.expiresAt,
});

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/AuthAPI/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toUser(await response.json());
};

export const registerUser = async (fullName, email, password) => {
  const [firstName, ...rest] = fullName.trim().split(/\s+/);
  const response = await fetch(`${API_BASE_URL}/AuthAPI/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify({
      firstName,
      lastName: rest.join(' ') || firstName,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toUser(await response.json());
};

export const getAllUsers = async (accessToken) => {
  const response = await fetch(`${API_BASE_URL}/AuthAPI/all`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

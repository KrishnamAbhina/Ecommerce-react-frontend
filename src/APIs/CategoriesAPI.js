import apiFetch from './apiClient';
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

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/CategoryAPI`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const getCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/CategoryAPI/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const addCategory = async (name, description, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CategoryAPI`, {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const updateCategory = async (id, name, description, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CategoryAPI/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const deleteCategory = async (id, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CategoryAPI/${id}`, {
    method: 'DELETE',
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return { success: true };
};

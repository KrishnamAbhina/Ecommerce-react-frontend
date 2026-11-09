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

export const getCartItems = async (accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CartAPI`, { method: 'GET' }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const addToCart = async (productId, quantity, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CartAPI`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const updateCartItem = async (cartItemId, productId, quantity, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CartAPI/${cartItemId}`, {
    method: 'PUT',
    body: JSON.stringify({ productId, quantity }),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json();
};

export const removeFromCart = async (cartItemId, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/CartAPI/${cartItemId}`, {
    method: 'DELETE',
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return { success: true };
};

import apiFetch from './apiClient';
import { API_BASE_URL } from './config';

export const placeOrder = async (order, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/OrdersAPI`, {
    method: 'POST',
    body: JSON.stringify(order),
  }, accessToken);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const getOrdersByUser = async (userId, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/OrdersAPI/user/${encodeURIComponent(userId)}`, {
    method: 'GET',
  }, accessToken);

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

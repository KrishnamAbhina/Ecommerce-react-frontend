import apiFetch from './apiClient';
import { API_BASE_URL, GATEWAY_URL } from './config';

const readError = async (response) => {
  const text = await response.text().catch(() => '');
  try {
    const json = JSON.parse(text);
    return json.message || json.title || text;
  } catch {
    return text || `HTTP error! status: ${response.status}`;
  }
};

const toImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
  return `${GATEWAY_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const toProduct = (p) => ({
  ...p,
  imageUrl: toImageUrl(p.imagePath),
  stock: p.quantity ?? 0,
});

const toPayload = (name, description, price, categoryId, quantity, imagePath) => ({
  name,
  description,
  price: Number(price),
  categoryId: Number(categoryId),
  quantity: Number(quantity),
  imagePath: imagePath || null,
});

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/ProductsAPI`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = await response.json();
  return data.map(toProduct);
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/ProductsAPI/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toProduct(await response.json());
};

export const uploadProductImage = async (file, accessToken) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/ProductsAPI/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: formData,
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  const data = await response.json();
  return data.imagePath;
};

export const addProduct = async (name, description, price, categoryId, quantity, imagePath, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/ProductsAPI`, {
    method: 'POST',
    body: JSON.stringify(toPayload(name, description, price, categoryId, quantity, imagePath)),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toProduct(await response.json());
};

export const updateProduct = async (id, name, description, price, categoryId, quantity, imagePath, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/ProductsAPI/${id}`, {
    method: 'PUT',
    body: JSON.stringify(toPayload(name, description, price, categoryId, quantity, imagePath)),
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return toProduct(await response.json());
};

export const deleteProduct = async (id, accessToken) => {
  const response = await apiFetch(`${API_BASE_URL}/ProductsAPI/${id}`, {
    method: 'DELETE',
  }, accessToken);

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return { success: true };
};

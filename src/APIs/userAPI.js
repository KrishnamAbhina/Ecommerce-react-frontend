import apiFetch from './apiClient';

import { API_BASE_URL } from './config';

// GET all users
export const getAllUsers = async (accessToken) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/AuthAPI/all`, {
      method: 'GET',
    }, accessToken);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Users fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

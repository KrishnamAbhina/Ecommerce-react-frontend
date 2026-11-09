// TODO: re-enable once Inventory routes are added to ocelot.json
/*
import { API_BASE_URL } from './config';

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Inventory`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Products fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
*/

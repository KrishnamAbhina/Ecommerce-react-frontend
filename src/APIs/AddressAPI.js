// TODO: re-enable once Address routes are added to ocelot.json
/*
import { API_BASE_URL } from './config';

export const createAddress = async (addressData, accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      mode: 'cors',
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Address created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

export const getUserAddresses = async (accessToken) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Address/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User addresses fetched successfully:', data);
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};
*/

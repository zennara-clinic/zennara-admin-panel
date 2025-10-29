import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const API_URL = `${API_BASE_URL}/api/admin/product-orders`;

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Get order statistics
export const getOrderStats = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order statistics:', error);
    throw error;
  }
};

// Get all orders
export const getAllOrders = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

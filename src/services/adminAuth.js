// Admin Authentication API Service
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.ADMIN_AUTH;

class AdminAuthService {
  // Check if email is authorized
  async checkEmail(email) {
    try {
      const response = await fetch(`${API_URL}/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Check email error:', error);
      throw error;
    }
  }

  // Request OTP for login
  async requestOTP(email) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      return data;
    } catch (error) {
      console.error('Request OTP error:', error);
      throw error;
    }
  }

  // Verify OTP and login
  async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // Store auth data in localStorage
      if (data.data) {
        localStorage.setItem('adminToken', data.data.token);
        localStorage.setItem('adminData', JSON.stringify(data.data.admin));
        localStorage.setItem('adminTokenExpiry', data.data.expiresAt);
      }

      return data;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await fetch(`${API_URL}/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('Resend OTP error:', error);
      throw error;
    }
  }

  // Get admin profile
  async getProfile() {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminTokenExpiry');

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminTokenExpiry');
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('adminToken');
    const expiry = localStorage.getItem('adminTokenExpiry');

    if (!token || !expiry) {
      return false;
    }

    // Check if token is expired
    const expiryDate = new Date(expiry);
    const now = new Date();

    if (now >= expiryDate) {
      // Token expired, clear storage
      this.logout();
      return false;
    }

    return true;
  }

  // Get admin data from localStorage
  getAdminData() {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Get token
  getToken() {
    return localStorage.getItem('adminToken');
  }
}

export default new AdminAuthService();

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/analytics';

// Get auth token
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Get financial analytics
export const getFinancialAnalytics = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/financial`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    throw error;
  }
};

// Get monthly revenue trend
export const getMonthlyRevenueTrend = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/revenue/monthly`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly revenue trend:', error);
    throw error;
  }
};

// Get daily target progress
export const getDailyTargetProgress = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/target/daily`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching daily target progress:', error);
    throw error;
  }
};

// Get patient analytics overview
export const getPatientAnalytics = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/patients`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient analytics:', error);
    throw error;
  }
};

// Get patient acquisition trend
export const getPatientAcquisitionTrend = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/patients/acquisition`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient acquisition trend:', error);
    throw error;
  }
};

// Get top valuable patients
export const getTopPatients = async (limit = 5) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/patients/top`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top patients:', error);
    throw error;
  }
};

// Get patient demographics
export const getPatientDemographics = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/patients/demographics`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient demographics:', error);
    throw error;
  }
};

// Get patient sources
export const getPatientSources = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/patients/sources`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patient sources:', error);
    throw error;
  }
};

// Send birthday wish email
export const sendBirthdayWish = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/patients/${userId}/birthday-wish`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error sending birthday wish:', error);
    throw error;
  }
};

// Get appointment analytics
export const getAppointmentAnalytics = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/appointments`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching appointment analytics:', error);
    throw error;
  }
};

// Get service analytics
export const getServiceAnalytics = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/services`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching service analytics:', error);
    throw error;
  }
};

// Get inventory analytics
export const getInventoryAnalytics = async (params = {}) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/inventory`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    throw error;
  }
};

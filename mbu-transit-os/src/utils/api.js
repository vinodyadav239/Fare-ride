// API utility functions for MBU Transit OS

const API_BASE_URL = 'http://localhost:3001/api';

const api = {
  // Authentication
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Student APIs
  bookRide: async (rideData) => {
    const response = await fetch(`${API_BASE_URL}/rides/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rideData),
    });
    return response.json();
  },

  getStudentRides: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/rides/student/${studentId}`);
    return response.json();
  },

  // Driver APIs
  getAvailableRides: async () => {
    const response = await fetch(`${API_BASE_URL}/rides/available`);
    return response.json();
  },

  acceptRide: async (rideId, driverId) => {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ driverId }),
    });
    return response.json();
  },

  updateRideStatus: async (rideId, status) => {
    const response = await fetch(`${API_BASE_URL}/rides/${rideId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  // Admin APIs
  getAllRides: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/rides`);
    return response.json();
  },

  getDriverRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/driver-requests`);
    return response.json();
  },

  approveDriver: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/admin/driver-requests/${requestId}/approve`, {
      method: 'POST',
    });
    return response.json();
  },

  rejectDriver: async (requestId) => {
    const response = await fetch(`${API_BASE_URL}/admin/driver-requests/${requestId}/reject`, {
      method: 'POST',
    });
    return response.json();
  },

  getSystemStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);
    return response.json();
  }
};

export default api;

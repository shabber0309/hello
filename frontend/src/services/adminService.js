import { request } from './api';

export const adminService = {
  getOverview: async () => {
    return request('/api/admin/overview');
  },

  getUsers: async () => {
    return request('/api/admin/users');
  },

  getOrders: async () => {
    return request('/api/admin/orders');
  },

  createUser: async (userData) => {
    return request('/api/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  updateUser: async (userId, userData) => {
    return request(`/api/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  deleteUser: async (userId) => {
    return request(`/api/admin/users/${userId}`, {
      method: 'DELETE'
    });
  },

  updateOrder: async (orderId, orderData) => {
    return request(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    });
  },

  deleteOrder: async (orderId) => {
    return request(`/api/admin/orders/${orderId}`, {
      method: 'DELETE'
    });
  },

  runQuery: async (sqlQuery) => {
    return request('/api/admin/query', {
      method: 'POST',
      body: JSON.stringify({ query: sqlQuery })
    });
  }
};

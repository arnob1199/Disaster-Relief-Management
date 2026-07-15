import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 'Content-Type': 'application/json' }
});

client.interceptors.request.use((config) => {
  const saved = localStorage.getItem('disaster_relief_auth');
  if (saved) {
    const { token } = JSON.parse(saved);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('disaster_relief_auth');
      window.dispatchEvent(new Event('disaster-relief:logout'));
    }
    return Promise.reject(err);
  }
);

export const getErrorMessage = (err) => err.response?.data?.message || 'Something went wrong. Please try again.';

export const api = {
  auth: {
    login: (payload) => client.post('/auth/login', payload),
    register: (payload) => client.post('/auth/register', payload)
  },
  shelters: {
    list: () => client.get('/shelters'),
    create: (payload) => client.post('/shelters', payload),
    update: (id, payload) => client.put(`/shelters/${id}`, payload),
    remove: (id) => client.delete(`/shelters/${id}`)
  },
  supplies: {
    list: () => client.get('/supplies'),
    create: (payload) => client.post('/supplies', payload),
    update: (id, payload) => client.put(`/supplies/${id}`, payload),
    remove: (id) => client.delete(`/supplies/${id}`)
  },
  requests: {
    list: () => client.get('/requests'),
    create: (payload) => client.post('/requests', payload),
    updateStatus: (id, status) => client.put(`/requests/${id}/status`, { status }),
    remove: (id) => client.delete(`/requests/${id}`)
  },
  distributions: {
    list: () => client.get('/distributions'),
    create: (payload) => client.post('/distributions', payload),
    remove: (id) => client.delete(`/distributions/${id}`)
  },
  dashboard: {
    admin: () => client.get('/dashboard/admin'),
    victim: () => client.get('/dashboard/victim')
  }
};

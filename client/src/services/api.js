import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('dbs_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('dbs_token', response.data.token);
            localStorage.setItem('dbs_user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('dbs_token');
        localStorage.removeItem('dbs_user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('dbs_user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const formService = {
    submitForm: async (data) => {
        const response = await api.post('/forms', data);
        return response.data;
    },
    getSubmissions: async () => {
        const response = await api.get('/forms');
        return response.data;
    },
    getSubmissionById: async (id) => {
        const response = await api.get(`/forms/${id}`);
        return response.data;
    }
};

export default api;

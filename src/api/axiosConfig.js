import axios from 'axios';
import { BASE_URL } from './endpoints';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout on 401
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            // Optional: Redirect to login or dispatch an event
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

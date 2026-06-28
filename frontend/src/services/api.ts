import axios from 'axios';

const API_BASE = 'http://localhost:5216/api';

export const apiClient = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const analysisApi = {
    analyse: (data: any) => apiClient.post('/analysis', data).then(r => r.data),
    getHistory: () => apiClient.get('/analysis').then(r => r.data),
    getAnalysis: (id: string) => apiClient.get(`/analysis/${id}`).then(r => r.data),
    uploadResume: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post('/Upload/resume', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(r => r.data);
    }
};
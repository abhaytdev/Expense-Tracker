import api from './axiosConfig';

export const getSummary = () => api.get('/dashboard/summary');

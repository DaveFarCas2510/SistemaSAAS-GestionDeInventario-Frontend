import axiosInstance from './axiosInstance'

export const loginApi = (credentials) =>
  axiosInstance.post('/api/auth/login', credentials)
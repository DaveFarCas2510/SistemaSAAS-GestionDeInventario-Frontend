import axiosInstance from './axiosInstance'

export const createUser = (data) =>
  axiosInstance.post('/api/users', data)
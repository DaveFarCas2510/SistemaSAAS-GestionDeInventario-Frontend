import axiosInstance from './axiosInstance'

export const getCategories = () =>
  axiosInstance.get('/api/categories')

export const createCategory = (data) =>
  axiosInstance.post('/api/categories', data)
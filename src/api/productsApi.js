import axiosInstance from './axiosInstance'

export const getProductsPaged = (page = 0, size = 10) =>
  axiosInstance.get(`/api/products/page?page=${page}&size=${size}`)

export const searchProducts = (name) =>
  axiosInstance.get(`/api/products/search?name=${encodeURIComponent(name)}`)

export const getProductById = (id) =>
  axiosInstance.get(`/api/products/${id}`)

export const createProduct = (data) =>
  axiosInstance.post('/api/products', data)

export const deleteProduct = (id) =>
  axiosInstance.delete(`/api/products/${id}`)

export const adjustStock = (id, quantity) =>
  axiosInstance.put(`/api/products/${id}/adjust-stock?quantity=${quantity}`)

export const getMovements = (id) =>
  axiosInstance.get(`/api/products/${id}/movements`)

export const updateProduct = (id, data) =>
  axiosInstance.put(`/api/products/${id}`, data)

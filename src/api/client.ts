import axios from "axios";

import { getAccessToken } from '@/lib/getAccessToken'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  // baseURL:'http://localhost:3001/',
})

// Attach token to every request
apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


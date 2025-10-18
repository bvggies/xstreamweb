import axios from 'axios'
import { getAuthToken } from './auth'
import { Match, User, Subscription, AuthResponse, PaystackResponse, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('xstream_token')
      localStorage.removeItem('xstream_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Matches API
export const matchesApi = {
  getMatches: async (params?: { status?: string; limit?: number; page?: number }): Promise<ApiResponse<Match[]>> => {
    const response = await api.get('/matches', { params })
    return response.data
  },

  getMatch: async (id: string): Promise<Match> => {
    const response = await api.get(`/matches/${id}`)
    return response.data
  },

  getLiveMatches: async (): Promise<{ matches: Match[] }> => {
    const response = await api.get('/matches/live/current')
    return response.data
  },

  getUpcomingMatches: async (): Promise<{ matches: Match[] }> => {
    const response = await api.get('/matches/upcoming/list')
    return response.data
  },
}

// Admin API
export const adminApi = {
  createMatch: async (matchData: Partial<Match>): Promise<{ message: string; match: Match }> => {
    const response = await api.post('/admin/matches', matchData)
    return response.data
  },

  updateMatch: async (id: string, matchData: Partial<Match>): Promise<{ message: string; match: Match }> => {
    const response = await api.put(`/admin/matches/${id}`, matchData)
    return response.data
  },

  deleteMatch: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/matches/${id}`)
    return response.data
  },

  getMatches: async (params?: { status?: string; limit?: number; page?: number }): Promise<ApiResponse<Match[]>> => {
    const response = await api.get('/admin/matches', { params })
    return response.data
  },

  getMatch: async (id: string): Promise<Match> => {
    const response = await api.get(`/admin/matches/${id}`)
    return response.data
  },
}

// Paystack API
export const paystackApi = {
  initializePayment: async (data: { email: string; amount?: number }): Promise<PaystackResponse> => {
    const response = await api.post('/paystack/initialize', data)
    return response.data
  },

  verifyPayment: async (reference: string): Promise<{ message: string; subscription: any }> => {
    const response = await api.post('/paystack/verify', { reference })
    return response.data
  },
}

// Subscription API
export const subscriptionApi = {
  getStatus: async (): Promise<{ subscription: any }> => {
    const response = await api.get('/subscription/status')
    return response.data
  },

  getHistory: async (): Promise<{ subscriptions: Subscription[] }> => {
    const response = await api.get('/subscription/history')
    return response.data
  },

  renew: async (): Promise<{ message: string; subscription: any }> => {
    const response = await api.post('/subscription/renew')
    return response.data
  },
}

// Convenience functions
export const getMatches = matchesApi.getMatches
export const getMatch = matchesApi.getMatch
export const getLiveMatches = matchesApi.getLiveMatches
export const getUpcomingMatches = matchesApi.getUpcomingMatches

export default api

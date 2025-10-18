import Cookies from 'js-cookie'
import { User } from '@/types'

const TOKEN_KEY = 'xstream_token'
const USER_KEY = 'xstream_user'

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export const getAuthToken = (): string | null => {
  return Cookies.get(TOKEN_KEY) || null
}

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(USER_KEY)
}

export const setUser = (user: User) => {
  Cookies.set(USER_KEY, JSON.stringify(user), { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

export const getUser = (): User | null => {
  const userStr = Cookies.get(USER_KEY)
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

export const hasActiveSubscription = (user: User | null): boolean => {
  if (!user) return false
  
  return user.subscription.plan === 'premium' && 
         user.subscription.expiresAt && 
         new Date(user.subscription.expiresAt) > new Date()
}

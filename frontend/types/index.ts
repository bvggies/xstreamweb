export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  subscription: {
    plan: 'free' | 'premium'
    expiresAt?: string
  }
  createdAt: string
}

export interface Match {
  _id: string
  title: string
  league: string
  kickoff_time: string
  thumbnail: string
  stream_links: string[]
  status: 'upcoming' | 'live' | 'ended'
  apiFootballId?: number
  home_team: string
  away_team: string
  score: {
    home: number
    away: number
  }
  createdAt: string
}

export interface Subscription {
  _id: string
  userId: string
  plan: 'premium'
  reference: string
  status: 'pending' | 'success' | 'failed'
  amount: number
  expiresAt: string
  createdAt: string
}

export interface ApiResponse<T> {
  message?: string
  data?: T
  matches?: T[]
  total?: number
  totalPages?: number
  currentPage?: number
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface PaystackResponse {
  message: string
  authorization_url: string
  reference: string
}

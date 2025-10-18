'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Crown, Play } from 'lucide-react'
import { getAuthToken, removeAuthToken, getUser } from '@/lib/auth'
import { User as UserType } from '@/types'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      const userData = getUser()
      setUser(userData)
    }
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    setUser(null)
    router.push('/')
  }

  const isAdmin = user?.role === 'admin'
  const hasActiveSubscription = user?.subscription?.plan === 'premium' && 
    user?.subscription?.expiresAt && 
    new Date(user.subscription.expiresAt) > new Date()

  return (
    <nav className="bg-dark-900/95 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display gradient-text">
              Xstream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              href="/matches" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Matches
            </Link>
            <Link 
              href="/fixtures" 
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Fixtures
            </Link>
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-gray-300 hover:text-white transition-colors duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-dark-700 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {hasActiveSubscription && (
                  <div className="flex items-center space-x-1 bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full text-xs">
                    <Crown className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/login" 
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800 rounded-lg mt-2">
              <Link 
                href="/" 
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/matches" 
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Matches
              </Link>
              <Link 
                href="/fixtures" 
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Fixtures
              </Link>
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              {user ? (
                <div className="border-t border-dark-700 pt-3 mt-3">
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-300">{user.name}</span>
                    </div>
                    {hasActiveSubscription && (
                      <div className="flex items-center space-x-1 bg-accent-500/20 text-accent-400 px-2 py-1 rounded-full text-xs mt-2 w-fit">
                        <Crown className="w-3 h-3" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-dark-700 pt-3 mt-3 space-y-2">
                  <Link 
                    href="/login" 
                    className="block px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="block px-3 py-2 bg-primary-500 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

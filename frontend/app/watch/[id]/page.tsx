'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Crown, Lock, Play, Trophy, Clock, Users } from 'lucide-react'
import { getMatch } from '@/lib/api'
import { getUser, hasActiveSubscription } from '@/lib/auth'
import { Match, User } from '@/types'
import VideoPlayer from '@/components/VideoPlayer'
import Link from 'next/link'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function WatchPage() {
  const params = useParams()
  const router = useRouter()
  const [match, setMatch] = useState<Match | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true)
        const matchData = await getMatch(params.id as string)
        setMatch(matchData)
        
        const userData = getUser()
        setUser(userData)
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to load match')
        toast.error('Failed to load match')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchMatch()
    }
  }, [params.id])

  const canWatch = user && hasActiveSubscription(user)
  const hasStreamLinks = match?.stream_links && match.stream_links.length > 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-primary-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Match...</h3>
          <p className="text-gray-400">Please wait while we load the match details</p>
        </div>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Match Not Found</h3>
          <p className="text-gray-400 mb-6">{error || 'The match you are looking for does not exist'}</p>
          <Link href="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Matches</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">{match.league}</span>
              {match.status === 'live' && (
                <span className="live-indicator">LIVE</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2">
            {/* Match Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{match.title}</h1>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {match.status === 'live' ? 'Live Now' : 
                     match.status === 'upcoming' ? format(new Date(match.kickoff_time), 'MMM dd, HH:mm') :
                     'Match Ended'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{match.home_team} vs {match.away_team}</span>
                </div>
              </div>
            </div>

            {/* Video Player or Subscription Required */}
            {canWatch && hasStreamLinks ? (
              <VideoPlayer 
                streamUrl={match.stream_links[0]} 
                poster={match.thumbnail}
                className="mb-6"
              />
            ) : (
              <div className="video-container mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900 flex items-center justify-center">
                  <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Crown className="w-10 h-10 text-primary-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Premium Required</h3>
                    <p className="text-gray-400 mb-6">
                      Subscribe to Xstream Premium to watch live matches in HD quality
                    </p>
                    <Link href="/subscription" className="btn-primary">
                      <Crown className="w-5 h-5 mr-2" />
                      Subscribe Now
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Match Details */}
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Match Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Teams</h4>
                  <p className="text-white">{match.home_team} vs {match.away_team}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">League</h4>
                  <p className="text-white">{match.league}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Kickoff Time</h4>
                  <p className="text-white">{format(new Date(match.kickoff_time), 'MMM dd, yyyy - HH:mm')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Status</h4>
                  <p className="text-white capitalize">{match.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Live Score</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {match.score?.home || 0} - {match.score?.away || 0}
                </div>
                <div className="text-gray-400">
                  {match.home_team} vs {match.away_team}
                </div>
              </div>
            </div>

            {/* Subscription Status */}
            {user && (
              <div className="card">
                <h3 className="text-lg font-semibold text-white mb-4">Your Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Plan</span>
                    <span className={`font-semibold ${hasActiveSubscription(user) ? 'text-accent-400' : 'text-gray-400'}`}>
                      {hasActiveSubscription(user) ? 'Premium' : 'Free'}
                    </span>
                  </div>
                  {hasActiveSubscription(user) && user.subscription.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expires</span>
                      <span className="text-white">
                        {format(new Date(user.subscription.expiresAt), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {!hasActiveSubscription(user) && (
                    <Link href="/subscription" className="btn-primary w-full text-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/matches" className="block w-full text-center py-2 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors">
                  View All Matches
                </Link>
                <Link href="/fixtures" className="block w-full text-center py-2 px-4 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors">
                  Upcoming Fixtures
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="block w-full text-center py-2 px-4 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors">
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

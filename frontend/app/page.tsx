'use client'

import { useState, useEffect } from 'react'
import { Play, Clock, Trophy, Users } from 'lucide-react'
import MatchCard from '@/components/MatchCard'
import { getMatches } from '@/lib/api'
import { Match } from '@/types'

export default function HomePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recent'>('live')

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const status = activeTab === 'recent' ? 'ended' : activeTab
      const data = await getMatches({ status })
      setMatches(data.matches || [])
    } catch (error) {
      console.error('Error fetching matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const liveMatches = matches.filter(match => match.status === 'live')
  const upcomingMatches = matches.filter(match => match.status === 'upcoming')
  const recentMatches = matches.filter(match => match.status === 'ended')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            <span className="gradient-text">Xstream</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Watch live football matches in HD quality. Never miss a moment of the action with our premium streaming service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Watch Live Now
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              <Trophy className="w-5 h-5 mr-2" />
              View Fixtures
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Matches</h3>
              <p className="text-gray-400">Watch matches in real-time with HD quality streaming</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Live Scores</h3>
              <p className="text-gray-400">Get real-time scores and match updates</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Access</h3>
              <p className="text-gray-400">Unlimited access to all matches and features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold font-display mb-4">
              <span className="gradient-text">Live Football</span>
            </h2>
            <p className="text-gray-400 text-lg">Never miss a moment of the beautiful game</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-dark-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('live')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'live'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Live Now ({liveMatches.length})
              </button>
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'upcoming'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Upcoming ({upcomingMatches.length})
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  activeTab === 'recent'
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Recent ({recentMatches.length})
              </button>
            </div>
          </div>

          {/* Matches Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="match-card animate-pulse">
                  <div className="h-48 bg-dark-700 rounded-lg mb-4"></div>
                  <div className="h-4 bg-dark-700 rounded mb-2"></div>
                  <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.length > 0 ? (
                matches.map((match) => (
                  <MatchCard key={match._id} match={match} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="w-24 h-24 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-12 h-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">
                    No {activeTab} matches found
                  </h3>
                  <p className="text-gray-500">
                    Check back later for more matches
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

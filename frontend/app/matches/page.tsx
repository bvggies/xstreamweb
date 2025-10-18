'use client'

import { useState, useEffect } from 'react'
import { Trophy, Clock, Play, Users } from 'lucide-react'
import MatchCard from '@/components/MatchCard'
import { getMatches } from '@/lib/api'
import { Match } from '@/types'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all')

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const status = activeTab === 'all' ? undefined : activeTab
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
  const endedMatches = matches.filter(match => match.status === 'ended')

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display mb-4">
            <span className="gradient-text">All Matches</span>
          </h1>
          <p className="text-gray-400 text-lg">Never miss a moment of the beautiful game</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({matches.length})
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'live'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Live ({liveMatches.length})
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
              onClick={() => setActiveTab('ended')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                activeTab === 'ended'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Results ({endedMatches.length})
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
                  No matches found
                </h3>
                <p className="text-gray-500">
                  Check back later for more matches
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

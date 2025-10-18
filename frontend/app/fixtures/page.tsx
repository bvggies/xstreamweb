'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, Trophy, Users } from 'lucide-react'
import MatchCard from '@/components/MatchCard'
import { getUpcomingMatches } from '@/lib/api'
import { Match } from '@/types'
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns'

export default function FixturesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<'today' | 'tomorrow' | 'week' | 'all'>('today')

  useEffect(() => {
    fetchMatches()
  }, [selectedDate])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const data = await getUpcomingMatches()
      let filteredMatches = data.matches || []

      // Filter by date
      const now = new Date()
      switch (selectedDate) {
        case 'today':
          filteredMatches = filteredMatches.filter(match => 
            isToday(new Date(match.kickoff_time))
          )
          break
        case 'tomorrow':
          filteredMatches = filteredMatches.filter(match => 
            isTomorrow(new Date(match.kickoff_time))
          )
          break
        case 'week':
          filteredMatches = filteredMatches.filter(match => 
            isThisWeek(new Date(match.kickoff_time))
          )
          break
        default:
          // Show all upcoming matches
          break
      }

      setMatches(filteredMatches)
    } catch (error) {
      console.error('Error fetching fixtures:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateLabel = () => {
    switch (selectedDate) {
      case 'today':
        return 'Today'
      case 'tomorrow':
        return 'Tomorrow'
      case 'week':
        return 'This Week'
      default:
        return 'All Upcoming'
    }
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-display mb-4">
            <span className="gradient-text">Fixtures</span>
          </h1>
          <p className="text-gray-400 text-lg">Upcoming football matches and schedules</p>
        </div>

        {/* Date Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 p-1 rounded-lg">
            <button
              onClick={() => setSelectedDate('today')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                selectedDate === 'today'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setSelectedDate('tomorrow')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                selectedDate === 'tomorrow'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setSelectedDate('week')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                selectedDate === 'week'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setSelectedDate('all')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                selectedDate === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              All Upcoming
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{getDateLabel()}</h3>
            <p className="text-gray-400 text-sm">{matches.length} matches scheduled</p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Leagues</h3>
            <p className="text-gray-400 text-sm">
              {new Set(matches.map(m => m.league)).size} different leagues
            </p>
          </div>
          <div className="card text-center">
            <div className="w-12 h-12 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Teams</h3>
            <p className="text-gray-400 text-sm">
              {new Set([...matches.map(m => m.home_team), ...matches.map(m => m.away_team)]).size} teams
            </p>
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
                  <Calendar className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  No fixtures found for {getDateLabel().toLowerCase()}
                </h3>
                <p className="text-gray-500">
                  Check back later for updated schedules
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

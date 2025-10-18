'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, Trophy, Users } from 'lucide-react'
import { Match } from '@/types'
import { format } from 'date-fns'

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const [imageError, setImageError] = useState(false)

  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return (
          <span className="live-indicator">
            LIVE
          </span>
        )
      case 'upcoming':
        return (
          <span className="status-upcoming px-2 py-1 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3 inline mr-1" />
            Upcoming
          </span>
        )
      case 'ended':
        return (
          <span className="status-ended px-2 py-1 rounded-full text-xs font-semibold">
            <Trophy className="w-3 h-3 inline mr-1" />
            Ended
          </span>
        )
      default:
        return null
    }
  }

  const formatKickoffTime = (date: string) => {
    try {
      return format(new Date(date), 'MMM dd, HH:mm')
    } catch {
      return 'TBD'
    }
  }

  const getScoreDisplay = () => {
    if (match.status === 'live' || match.status === 'ended') {
      return (
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">
            {match.score?.home || 0} - {match.score?.away || 0}
          </div>
          <div className="text-sm text-gray-400">
            {match.home_team} vs {match.away_team}
          </div>
        </div>
      )
    }
    
    return (
      <div className="text-center">
        <div className="text-lg font-semibold text-white mb-1">
          {match.home_team} vs {match.away_team}
        </div>
        <div className="text-sm text-gray-400">
          {formatKickoffTime(match.kickoff_time)}
        </div>
      </div>
    )
  }

  return (
    <Link href={`/watch/${match._id}`} className="block">
      <div className="match-card group">
        {/* Match Image */}
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          {!imageError ? (
            <Image
              src={match.thumbnail || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&h=300&fit=crop'}
              alt={`${match.home_team} vs ${match.away_team}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-primary-400" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-3">
          {/* League */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-400 font-semibold">
              {match.league}
            </span>
            <div className="flex items-center space-x-1 text-gray-400">
              <Users className="w-4 h-4" />
              <span className="text-sm">Premium</span>
            </div>
          </div>

          {/* Teams and Score */}
          {getScoreDisplay()}

          {/* Match Title */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white line-clamp-2">
              {match.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, BarChart3 } from 'lucide-react'
import { adminApi } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { Match, User } from '@/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    league: '',
    kickoff_time: '',
    thumbnail: '',
    stream_links: '',
    home_team: '',
    away_team: '',
    status: 'upcoming'
  })
  const router = useRouter()

  useEffect(() => {
    const userData = getUser()
    if (!userData || userData.role !== 'admin') {
      router.push('/')
      return
    }
    setUser(userData)
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      setLoading(true)
      const response = await adminApi.getMatches()
      setMatches(response.matches || [])
    } catch (error) {
      toast.error('Failed to fetch matches')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const matchData = {
        ...formData,
        kickoff_time: new Date(formData.kickoff_time).toISOString(),
        stream_links: formData.stream_links.split('\n').filter(link => link.trim()),
        status: formData.status as 'upcoming' | 'live' | 'ended'
      }

      if (editingMatch) {
        await adminApi.updateMatch(editingMatch._id, matchData)
        toast.success('Match updated successfully')
      } else {
        await adminApi.createMatch(matchData)
        toast.success('Match created successfully')
      }

      setShowModal(false)
      setEditingMatch(null)
      resetForm()
      fetchMatches()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save match')
    }
  }

  const handleEdit = (match: Match) => {
    setEditingMatch(match)
    setFormData({
      title: match.title,
      league: match.league,
      kickoff_time: new Date(match.kickoff_time).toISOString().slice(0, 16),
      thumbnail: match.thumbnail,
      stream_links: match.stream_links.join('\n'),
      home_team: match.home_team,
      away_team: match.away_team,
      status: match.status
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return

    try {
      await adminApi.deleteMatch(id)
      toast.success('Match deleted successfully')
      fetchMatches()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete match')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      league: '',
      kickoff_time: '',
      thumbnail: '',
      stream_links: '',
      home_team: '',
      away_team: '',
      status: 'upcoming'
    })
  }

  const openModal = () => {
    resetForm()
    setEditingMatch(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingMatch(null)
    resetForm()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-primary-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading Admin Dashboard...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage matches, streams, and content</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Matches</p>
                <p className="text-2xl font-bold text-white">{matches.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Live Matches</p>
                <p className="text-2xl font-bold text-white">
                  {matches.filter(m => m.status === 'live').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming</p>
                <p className="text-2xl font-bold text-white">
                  {matches.filter(m => m.status === 'upcoming').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ended</p>
                <p className="text-2xl font-bold text-white">
                  {matches.filter(m => m.status === 'ended').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Matches</h2>
          <button onClick={openModal} className="btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Add Match
          </button>
        </div>

        {/* Matches Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    League
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Kickoff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {matches.map((match) => (
                  <tr key={match._id} className="hover:bg-dark-800/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{match.title}</div>
                        <div className="text-sm text-gray-400">{match.home_team} vs {match.away_team}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {match.league}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        match.status === 'live' ? 'bg-red-500/20 text-red-400' :
                        match.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(match.kickoff_time).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(match)}
                          className="text-primary-400 hover:text-primary-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(match._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingMatch ? 'Edit Match' : 'Add New Match'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Match Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Manchester United vs Liverpool"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      League
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.league}
                      onChange={(e) => setFormData({...formData, league: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Premier League"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Home Team
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.home_team}
                      onChange={(e) => setFormData({...formData, home_team: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Manchester United"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Away Team
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.away_team}
                      onChange={(e) => setFormData({...formData, away_team: e.target.value})}
                      className="input-field"
                      placeholder="e.g., Liverpool"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kickoff Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.kickoff_time}
                      onChange={(e) => setFormData({...formData, kickoff_time: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stream Links (one per line)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.stream_links}
                    onChange={(e) => setFormData({...formData, stream_links: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/stream1.m3u8&#10;https://example.com/stream2.m3u8"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingMatch ? 'Update Match' : 'Create Match'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'

interface HistoricalGame {
  gameId: string
  date: string
  homeTeam: {
    name: string
    abbreviation: string
    score: number
  }
  awayTeam: {
    name: string
    abbreviation: string
    score: number
  }
  isPlayoffs: boolean
  overtime: boolean
  gameType: 'regular' | 'playoffs' | 'classic'
  summary?: string
}

export default function HistoricalPage() {
  const [games, setGames] = useState<HistoricalGame[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedGame, setSelectedGame] = useState<HistoricalGame | null>(null)
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    team: '',
    gameType: 'all',
    minScoreDiff: '',
    searchTerm: ''
  })

  // Demo data for historical games
  const demoGames: HistoricalGame[] = [
    {
      gameId: 'historic_1',
      date: '2016-06-19',
      homeTeam: { name: 'Cleveland Cavaliers', abbreviation: 'CLE', score: 93 },
      awayTeam: { name: 'Golden State Warriors', abbreviation: 'GSW', score: 89 },
      isPlayoffs: true,
      overtime: false,
      gameType: 'classic',
      summary: 'Game 7 NBA Finals - Cavaliers complete historic comeback from 3-1 deficit'
    },
    {
      gameId: 'historic_2',
      date: '2013-06-18',
      homeTeam: { name: 'Miami Heat', abbreviation: 'MIA', score: 95 },
      awayTeam: { name: 'San Antonio Spurs', abbreviation: 'SAS', score: 88 },
      isPlayoffs: true,
      overtime: true,
      gameType: 'classic',
      summary: 'Game 6 NBA Finals - Ray Allen\'s clutch 3-pointer forces overtime'
    },
    {
      gameId: 'historic_3',
      date: '2020-08-24',
      homeTeam: { name: 'Portland Trail Blazers', abbreviation: 'POR', score: 117 },
      awayTeam: { name: 'Denver Nuggets', abbreviation: 'DEN', score: 126 },
      isPlayoffs: true,
      overtime: true,
      gameType: 'playoffs',
      summary: 'Triple overtime thriller - Nuggets overcome 3-1 series deficit'
    },
    {
      gameId: 'historic_4',
      date: '2024-01-15',
      homeTeam: { name: 'Boston Celtics', abbreviation: 'BOS', score: 132 },
      awayTeam: { name: 'Los Angeles Lakers', abbreviation: 'LAL', score: 125 },
      isPlayoffs: false,
      overtime: false,
      gameType: 'regular',
      summary: 'High-scoring regular season matchup between conference rivals'
    },
    {
      gameId: 'historic_5',
      date: '2006-01-22',
      homeTeam: { name: 'Los Angeles Lakers', abbreviation: 'LAL', score: 122 },
      awayTeam: { name: 'Toronto Raptors', abbreviation: 'TOR', score: 104 },
      isPlayoffs: false,
      overtime: false,
      gameType: 'classic',
      summary: 'Kobe Bryant scores 81 points - second highest in NBA history'
    }
  ]

  useEffect(() => {
    loadHistoricalGames()
  }, [filters])

  const loadHistoricalGames = async () => {
    setLoading(true)
    try {
      // In a real app, this would filter based on the API
      const filteredGames = demoGames.filter(game => {
        if (filters.gameType !== 'all' && game.gameType !== filters.gameType) return false
        if (filters.team && !game.homeTeam.name.toLowerCase().includes(filters.team.toLowerCase()) && 
            !game.awayTeam.name.toLowerCase().includes(filters.team.toLowerCase())) return false
        if (filters.searchTerm && !game.summary?.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !game.homeTeam.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
            !game.awayTeam.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
        return true
      })
      setGames(filteredGames)
    } catch (error) {
      console.error('Failed to load historical games:', error)
      setGames(demoGames)
    } finally {
      setLoading(false)
    }
  }

  const getGameTypeColor = (gameType: string) => {
    switch (gameType) {
      case 'classic': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
      case 'playoffs': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-400 rounded-lg"></div>
          </div>
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-white">Game History</h1>
            <p className="text-gray-400 font-rajdhani">Explore legendary matchups with advanced analytics</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">Search Games</label>
              <input
                type="text"
                placeholder="Team, player, or keywords..."
                value={filters.searchTerm}
                onChange={(e) => setFilters({...filters, searchTerm: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">Game Type</label>
              <select
                value={filters.gameType}
                onChange={(e) => setFilters({...filters, gameType: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              >
                <option value="all">All Games</option>
                <option value="classic">Classic Games</option>
                <option value="playoffs">Playoffs</option>
                <option value="regular">Regular Season</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400 font-rajdhani">
              Found {games.length} games matching your criteria
            </div>
            <button
              onClick={() => setFilters({
                dateFrom: '',
                dateTo: '',
                team: '',
                gameType: 'all',
                minScoreDiff: '',
                searchTerm: ''
              })}
              className="text-sm text-purple-400 hover:text-purple-300 font-rajdhani"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          <span className="ml-4 text-xl">Loading historical games...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {games.map((game) => (
            <div key={game.gameId} className="card hover:border-purple-400/50 transition-colors cursor-pointer group" onClick={() => setSelectedGame(game)}>
              <div className="p-6">
                {/* Game Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400 font-rajdhani">
                    {formatDate(game.date)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-rajdhani font-semibold border ${getGameTypeColor(game.gameType)}`}>
                      {game.gameType.toUpperCase()}
                    </span>
                    {game.overtime && (
                      <span className="px-2 py-1 rounded-full text-xs font-rajdhani font-semibold bg-orange-400/10 text-orange-400 border border-orange-400/30">
                        OT
                      </span>
                    )}
                  </div>
                </div>

                {/* Teams and Score */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {game.awayTeam.abbreviation}
                      </div>
                      <span className="font-rajdhani font-medium text-white">{game.awayTeam.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                        {game.homeTeam.abbreviation}
                      </div>
                      <span className="font-rajdhani font-medium text-white">{game.homeTeam.name}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-orbitron font-bold text-white mb-1">
                      {game.awayTeam.score}
                    </div>
                    <div className="text-2xl font-orbitron font-bold text-white">
                      {game.homeTeam.score}
                    </div>
                  </div>
                </div>

                {/* Game Summary */}
                {game.summary && (
                  <div className="border-t border-gray-700/50 pt-4">
                    <p className="text-gray-300 font-rajdhani text-sm leading-relaxed">
                      {game.summary}
                    </p>
                  </div>
                )}

                {/* Explore Button */}
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <button className="w-full glass-button group-hover:bg-purple-400/20 group-hover:border-purple-400/50 transition-colors">
                    Explore Game Analytics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Game Details Modal would go here */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-premium max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-orbitron font-bold text-white">
                  {selectedGame.awayTeam.name} vs {selectedGame.homeTeam.name}
                </h2>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="text-center mb-6">
                <div className="text-gray-400 font-rajdhani mb-2">{formatDate(selectedGame.date)}</div>
                <div className="text-4xl font-orbitron font-bold text-white">
                  {selectedGame.awayTeam.score} - {selectedGame.homeTeam.score}
                </div>
              </div>
              {selectedGame.summary && (
                <p className="text-gray-300 font-rajdhani leading-relaxed mb-6">
                  {selectedGame.summary}
                </p>
              )}
              <div className="text-center">
                <button className="glass-button">
                  Load Full Analytics Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
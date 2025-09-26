'use client'

import { useState, useEffect } from 'react'
import { HistoricalGame, GameSearchFilters, GameSearchResult } from '@/types'

interface HistoricalGameSearchProps {
  onGameSelect?: (game: HistoricalGame) => void
}

export default function HistoricalGameSearch({ onGameSelect }: HistoricalGameSearchProps) {
  const [searchResults, setSearchResults] = useState<GameSearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<GameSearchFilters>({
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    playoffs: undefined
  })

  // Mock NBA teams - in production, this would come from an API
  const NBA_TEAMS = [
    { id: 'ATL', name: 'Atlanta Hawks' },
    { id: 'BOS', name: 'Boston Celtics' },
    { id: 'BKN', name: 'Brooklyn Nets' },
    { id: 'CHA', name: 'Charlotte Hornets' },
    { id: 'CHI', name: 'Chicago Bulls' },
    { id: 'CLE', name: 'Cleveland Cavaliers' },
    { id: 'DAL', name: 'Dallas Mavericks' },
    { id: 'DEN', name: 'Denver Nuggets' },
    { id: 'DET', name: 'Detroit Pistons' },
    { id: 'GSW', name: 'Golden State Warriors' },
    { id: 'HOU', name: 'Houston Rockets' },
    { id: 'IND', name: 'Indiana Pacers' },
    { id: 'LAC', name: 'LA Clippers' },
    { id: 'LAL', name: 'Los Angeles Lakers' },
    { id: 'MEM', name: 'Memphis Grizzlies' },
    { id: 'MIA', name: 'Miami Heat' },
    { id: 'MIL', name: 'Milwaukee Bucks' },
    { id: 'MIN', name: 'Minnesota Timberwolves' },
    { id: 'NOP', name: 'New Orleans Pelicans' },
    { id: 'NYK', name: 'New York Knicks' },
    { id: 'OKC', name: 'Oklahoma City Thunder' },
    { id: 'ORL', name: 'Orlando Magic' },
    { id: 'PHI', name: 'Philadelphia 76ers' },
    { id: 'PHX', name: 'Phoenix Suns' },
    { id: 'POR', name: 'Portland Trail Blazers' },
    { id: 'SAC', name: 'Sacramento Kings' },
    { id: 'SAS', name: 'San Antonio Spurs' },
    { id: 'TOR', name: 'Toronto Raptors' },
    { id: 'UTA', name: 'Utah Jazz' },
    { id: 'WAS', name: 'Washington Wizards' }
  ]

  const searchGames = async () => {
    setLoading(true)
    try {
      // This would call your backend API
      // For now, create mock data based on the filters
      const mockGames = generateMockHistoricalGames(filters)
      
      setSearchResults({
        games: mockGames,
        totalCount: mockGames.length,
        page: 1,
        pageSize: 25,
        hasMore: false
      })
    } catch (error) {
      console.error('Error searching games:', error)
      setSearchResults({ games: [], totalCount: 0, page: 1, pageSize: 25, hasMore: false })
    } finally {
      setLoading(false)
    }
  }

  // Mock data generator for demonstration
  const generateMockHistoricalGames = (filters: GameSearchFilters): HistoricalGame[] => {
    const games: HistoricalGame[] = []
    const startDate = new Date(filters.dateFrom || '2024-01-01')
    const endDate = new Date(filters.dateTo || '2024-12-31')
    
    for (let i = 0; i < 15; i++) {
      const gameDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
      const homeTeam = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)]
      let awayTeam = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)]
      while (awayTeam.id === homeTeam.id) {
        awayTeam = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)]
      }

      const homeScore = Math.floor(Math.random() * 50) + 90
      const awayScore = Math.floor(Math.random() * 50) + 90
      const overtimes = Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0

      games.push({
        id: `game-${i + 1}`,
        date: gameDate.toISOString().split('T')[0],
        season: gameDate.getFullYear(),
        homeTeam: { 
          id: homeTeam.id, 
          name: homeTeam.name.split(' ').pop() || homeTeam.name, 
          abbreviation: homeTeam.id,
          city: homeTeam.name.split(' ').slice(0, -1).join(' ')
        },
        awayTeam: { 
          id: awayTeam.id, 
          name: awayTeam.name.split(' ').pop() || awayTeam.name, 
          abbreviation: awayTeam.id,
          city: awayTeam.name.split(' ').slice(0, -1).join(' ')
        },
        homeScore,
        awayScore,
        gameStatus: 'FINAL',
        playoffs: filters.playoffs || Math.random() > 0.7,
        overtimePeriods: overtimes > 0 ? overtimes : undefined
      })
    }

    return games.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  useEffect(() => {
    searchGames()
  }, [])

  const handleFilterChange = (key: keyof GameSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const GameCard = ({ game }: { game: HistoricalGame }) => {
    const scoreDiff = Math.abs(game.homeScore - game.awayScore)
    const isCloseGame = scoreDiff <= 5
    const isHighScoring = game.homeScore + game.awayScore > 220

    return (
      <div 
        className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer border border-gray-700"
        onClick={() => onGameSelect?.(game)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-400">
            {new Date(game.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="flex space-x-2">
            {game.playoffs && (
              <span className="px-2 py-1 bg-yellow-600 text-yellow-100 text-xs rounded">
                PLAYOFFS
              </span>
            )}
            {game.overtimePeriods && (
              <span className="px-2 py-1 bg-purple-600 text-purple-100 text-xs rounded">
                {game.overtimePeriods}OT
              </span>
            )}
            {isCloseGame && (
              <span className="px-2 py-1 bg-red-600 text-red-100 text-xs rounded">
                CLOSE
              </span>
            )}
            {isHighScoring && (
              <span className="px-2 py-1 bg-orange-600 text-orange-100 text-xs rounded">
                HIGH SCORING
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Away Team */}
          <div className="text-center">
            <div className="text-sm text-gray-400">AWAY</div>
            <div className="font-semibold text-red-400">{game.awayTeam.abbreviation}</div>
            <div className="text-2xl font-bold">{game.awayScore}</div>
          </div>

          {/* VS */}
          <div className="text-center">
            <div className="text-gray-500 text-sm">VS</div>
            <div className="text-xs text-gray-400 mt-1">
              Final Score
            </div>
          </div>

          {/* Home Team */}
          <div className="text-center">
            <div className="text-sm text-gray-400">HOME</div>
            <div className="font-semibold text-blue-400">{game.homeTeam.abbreviation}</div>
            <div className="text-2xl font-bold">{game.homeScore}</div>
          </div>
        </div>

        {/* Winner */}
        <div className="mt-3 text-center">
          <div className="text-sm">
            {game.homeScore > game.awayScore ? (
              <span className="text-blue-400 font-medium">
                {game.homeTeam.name} won by {game.homeScore - game.awayScore}
              </span>
            ) : (
              <span className="text-red-400 font-medium">
                {game.awayTeam.name} won by {game.awayScore - game.homeScore}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-xl font-bold">🏀 Historical Game Search</h2>
        <p className="text-gray-400">Search NBA games from 1979 to present</p>
      </div>

      <div className="card-content">
        {/* Search Filters */}
        <div className="mb-6 p-4 bg-gray-750 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">From Date</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">To Date</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
              />
            </div>

            {/* Team Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Team</label>
              <select
                value={filters.teams?.[0] || ''}
                onChange={(e) => handleFilterChange('teams', e.target.value ? [e.target.value] : [])}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
              >
                <option value="">All Teams</option>
                {NBA_TEAMS.map(team => (
                  <option key={team.id} value={team.id}>{team.id} - {team.name}</option>
                ))}
              </select>
            </div>

            {/* Playoffs Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Game Type</label>
              <select
                value={filters.playoffs === undefined ? '' : filters.playoffs.toString()}
                onChange={(e) => handleFilterChange('playoffs', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
              >
                <option value="">All Games</option>
                <option value="false">Regular Season</option>
                <option value="true">Playoffs Only</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={searchGames}
              disabled={loading}
              className="px-4 py-2 bg-basketball-orange text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Search Games</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setFilters({
                  dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  dateTo: new Date().toISOString().split('T')[0],
                  playoffs: undefined
                })
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Search Results */}
        {searchResults && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Search Results ({searchResults.totalCount} games found)
              </h3>
              <div className="text-sm text-gray-400">
                Click any game for detailed analysis
              </div>
            </div>

            {searchResults.games.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">🏀</div>
                <div className="text-xl mb-2">No games found</div>
                <div>Try adjusting your search filters</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.games.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          Historical data powered by NBA.com • Games from 1979-present
        </div>
      </div>
    </div>
  )
}
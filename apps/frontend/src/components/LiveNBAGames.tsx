'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'

interface NBAGame {
  id: string
  date: string
  home_team: {
    id: number
    abbreviation: string
    city: string
    full_name: string
    name: string
  }
  visitor_team: {
    id: number
    abbreviation: string
    city: string
    full_name: string
    name: string
  }
  home_team_score: number
  visitor_team_score: number
  period: number
  time: string
  status: string
}

interface LiveNBAGamesProps {
  onSelectGame: (gameId: string) => void
}

export default function LiveNBAGames({ onSelectGame }: LiveNBAGamesProps) {
  const [todaysGames, setTodaysGames] = useState<NBAGame[]>([])
  const [liveGames, setLiveGames] = useState<NBAGame[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadNBAGames()
    
    // Refresh live games every 30 seconds
    const interval = setInterval(loadLiveGames, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadNBAGames = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [todaysResponse, liveResponse] = await Promise.allSettled([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/nba/games`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/nba/live-games`)
      ])
      
      if (todaysResponse.status === 'fulfilled' && todaysResponse.value.ok) {
        const data = await todaysResponse.value.json()
        setTodaysGames(data.games || [])
      }
      
      if (liveResponse.status === 'fulfilled' && liveResponse.value.ok) {
        const data = await liveResponse.value.json()
        setLiveGames(data.liveGames || [])
      }
      
    } catch (err) {
      console.error('Error loading NBA games:', err)
      setError('Failed to load NBA games. Using demo data instead.')
      
      // Fallback to demo data
      setTodaysGames([
        {
          id: 'demo-lal-gsw',
          date: new Date().toISOString().split('T')[0],
          home_team: {
            id: 1,
            abbreviation: 'LAL',
            city: 'Los Angeles',
            full_name: 'Los Angeles Lakers',
            name: 'Lakers'
          },
          visitor_team: {
            id: 2,
            abbreviation: 'GSW',
            city: 'Golden State',
            full_name: 'Golden State Warriors',
            name: 'Warriors'
          },
          home_team_score: 98,
          visitor_team_score: 102,
          period: 4,
          time: '2:34',
          status: 'Live'
        }
      ])
      setLiveGames([])
      
    } finally {
      setLoading(false)
    }
  }

  const loadLiveGames = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nba/live-games`)
      if (response.ok) {
        const data = await response.json()
        setLiveGames(data.liveGames || [])
      }
    } catch (err) {
      console.error('Error refreshing live games:', err)
    }
  }

  const formatGameTime = (game: NBAGame) => {
    if (game.status === 'Final') return 'Final'
    if (game.status === 'Scheduled' || game.period === 0) {
      return new Date(game.date).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit' 
      })
    }
    if (game.period > 4) {
      return `OT${game.period - 4} ${game.time}`
    }
    return `Q${game.period} ${game.time}`
  }

  const getGameStatusColor = (game: NBAGame) => {
    if (game.status === 'Live' || (game.period > 0 && game.period <= 4)) {
      return 'text-green-400'
    }
    if (game.status === 'Final') {
      return 'text-gray-400'
    }
    return 'text-blue-400'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-basketball-orange"></div>
            <span className="ml-4">Loading NBA games...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Games Section */}
      {liveGames.length > 0 && (
        <div className="card-premium">
          <div className="card-header">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="section-title text-xl">Live NBA Games</h3>
                <p className="section-subtitle">Real-time basketball intelligence</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {liveGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="font-bold">{game.visitor_team.abbreviation}</div>
                      <div className="text-2xl font-bold text-basketball-orange">
                        {game.visitor_team_score}
                      </div>
                    </div>
                    <div className="text-gray-400">@</div>
                    <div className="text-center">
                      <div className="font-bold">{game.home_team.abbreviation}</div>
                      <div className="text-2xl font-bold text-basketball-orange">
                        {game.home_team_score}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${getGameStatusColor(game)}`}>
                    {formatGameTime(game)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Today's Games Section */}
      <div className="card-premium">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-basketball-orange to-yellow-500 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <div>
                <h3 className="section-title text-xl">NBA Intelligence Hub</h3>
                <p className="section-subtitle">Real-time game monitoring and analysis</p>
              </div>
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-yellow-400 text-sm">
                <div className="w-4 h-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                </div>
                <span className="font-rajdhani font-semibold">{error}</span>
              </div>
            )}
          </div>
        </div>
        <div className="card-content">
          {todaysGames.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No NBA games scheduled for today.</p>
              <button
                onClick={loadNBAGames}
                className="mt-4 px-4 py-2 bg-basketball-orange hover:bg-orange-600 rounded-lg transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysGames.map((game) => (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game.id)}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center min-w-[60px]">
                      <div className="font-bold text-sm">{game.visitor_team.abbreviation}</div>
                      <div className="text-xs text-gray-400">{game.visitor_team.city}</div>
                      {(game.period > 0 || game.status === 'Final') && (
                        <div className="text-lg font-bold text-basketball-orange mt-1">
                          {game.visitor_team_score}
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400">@</div>
                    <div className="text-center min-w-[60px]">
                      <div className="font-bold text-sm">{game.home_team.abbreviation}</div>
                      <div className="text-xs text-gray-400">{game.home_team.city}</div>
                      {(game.period > 0 || game.status === 'Final') && (
                        <div className="text-lg font-bold text-basketball-orange mt-1">
                          {game.home_team_score}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getGameStatusColor(game)}`}>
                      {formatGameTime(game)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {game.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
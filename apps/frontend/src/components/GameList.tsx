'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
import LiveNBAGames from './LiveNBAGames'

interface Game {
  gameId: string
  teams: Array<{
    teamId: string
    opponentTeamId: string
    points: number
  }>
  lastUpdated: string
}

interface GameListProps {
  onGameSelect: (gameId: string) => void
}

export default function GameList({ onGameSelect }: GameListProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGames()
    
    // Refresh games every 30 seconds
    const interval = setInterval(loadGames, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadGames = async () => {
    try {
      setError(null)
      const data = await apiService.getGames()
      setGames(data.games || [])
    } catch (err) {
      console.error('Failed to load games:', err)
      setError('Failed to load games. Click to simulate a demo game.')
      // Show demo games when API is not available
      setGames([
        {
          gameId: 'demo-game-1',
          teams: [
            { teamId: 'Lakers', opponentTeamId: 'Warriors', points: 102 },
            { teamId: 'Warriors', opponentTeamId: 'Lakers', points: 98 }
          ],
          lastUpdated: new Date().toISOString()
        },
        {
          gameId: 'demo-game-2',
          teams: [
            { teamId: 'Celtics', opponentTeamId: 'Heat', points: 88 },
            { teamId: 'Heat', opponentTeamId: 'Celtics', points: 92 }
          ],
          lastUpdated: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createDemoGame = async () => {
    try {
      const demoGameId = `demo-${Date.now()}`
      
      // Try to create a demo game via API
      await apiService.simulateGame(demoGameId, 'HomeTeam', 'AwayTeam')
      
      // Refresh games list
      setTimeout(loadGames, 2000) // Wait for events to process
      
    } catch (err) {
      console.error('Failed to create demo game:', err)
      // Add a local demo game
      const demoGame: Game = {
        gameId: `demo-${Date.now()}`,
        teams: [
          { teamId: 'DemoHome', opponentTeamId: 'DemoAway', points: 0 },
          { teamId: 'DemoAway', opponentTeamId: 'DemoHome', points: 0 }
        ],
        lastUpdated: new Date().toISOString()
      }
      setGames(prev => [demoGame, ...prev])
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-basketball-orange"></div>
            <span className="ml-3 text-gray-300">Loading games...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* NBA Games Integration */}
      <LiveNBAGames onSelectGame={onGameSelect} />
    </div>
  )
}
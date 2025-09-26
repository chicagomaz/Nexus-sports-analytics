'use client'

import { useState, useEffect } from 'react'
import { LiveDashboardData } from '@/types'
import { apiService } from '@/lib/api'
import { useWebSocket } from '@/hooks/useWebSocket'
import Scoreboard from './dashboard/Scoreboard'
import WinProbability from './dashboard/WinProbability'
import TeamStats from './dashboard/TeamStats'
import PlayerStats from './dashboard/PlayerStats'
import RecentEvents from './dashboard/RecentEvents'
import KeyMetrics from './dashboard/KeyMetrics'

interface GameDashboardProps {
  gameId: string
}

export default function GameDashboard({ gameId }: GameDashboardProps) {
  const [dashboardData, setDashboardData] = useState<LiveDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // WebSocket connection for real-time updates
  const { isConnected, lastMessage } = useWebSocket(gameId)

  useEffect(() => {
    loadDashboardData()
  }, [gameId])

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    if (lastMessage && dashboardData) {
      try {
        const message = JSON.parse(lastMessage)
        
        switch (message.type) {
          case 'STATS_UPDATE':
            // Update team/player stats
            refreshDashboardData()
            break
          case 'WIN_PROBABILITY_UPDATE':
            // Update win probability
            setDashboardData(prev => {
              if (!prev) return prev
              return {
                ...prev,
                game: {
                  ...prev.game,
                  winProbability: message.data
                }
              }
            })
            break
          case 'GAME_EVENT':
            // Add new event to recent events
            setDashboardData(prev => {
              if (!prev) return prev
              return {
                ...prev,
                recentEvents: [message.data, ...prev.recentEvents].slice(0, 10)
              }
            })
            break
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }
  }, [lastMessage, dashboardData])

  const loadDashboardData = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await apiService.getLiveDashboard(gameId)
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load game data')
      // Load demo data for development
      setDashboardData(createDemoData(gameId))
    } finally {
      setLoading(false)
    }
  }

  const refreshDashboardData = async () => {
    try {
      const data = await apiService.getLiveDashboard(gameId)
      setDashboardData(data)
    } catch (err) {
      console.error('Failed to refresh dashboard data:', err)
    }
  }

  const simulateEvents = async () => {
    try {
      await apiService.simulateEvents(gameId, 'HomeTeam', 'AwayTeam', 10)
      // Data will be updated via WebSocket
    } catch (err) {
      console.error('Failed to simulate events:', err)
      // Fallback: refresh data after a delay
      setTimeout(refreshDashboardData, 1000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-basketball-orange"></div>
        <span className="ml-4 text-xl">Loading game dashboard...</span>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="card">
        <div className="card-content text-center py-12">
          <div className="text-red-400 text-lg mb-4">
            {error || 'No game data available'}
          </div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-basketball-orange hover:bg-orange-600 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Game Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button
            onClick={simulateEvents}
            className="px-4 py-2 bg-basketball-orange hover:bg-orange-600 rounded-lg text-sm transition-colors"
          >
            Simulate Events
          </button>
        </div>
      </div>

      {/* Scoreboard */}
      <Scoreboard game={dashboardData.game} />

      {/* Win Probability */}
      {dashboardData.game.winProbability && (
        <WinProbability prediction={dashboardData.game.winProbability} />
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Team Stats */}
        <div className="lg:col-span-2 space-y-6">
          <TeamStats
            homeStats={dashboardData.game.homeStats}
            awayStats={dashboardData.game.awayStats}
            homeTeam={dashboardData.game.homeTeam}
            awayTeam={dashboardData.game.awayTeam}
          />
          
          <PlayerStats
            homePerformers={dashboardData.topPerformers.home}
            awayPerformers={dashboardData.topPerformers.away}
            homeTeam={dashboardData.game.homeTeam}
            awayTeam={dashboardData.game.awayTeam}
          />
        </div>

        {/* Right Column - Events and Metrics */}
        <div className="space-y-6">
          <KeyMetrics metrics={dashboardData.keyMetrics} />
          <RecentEvents events={dashboardData.recentEvents} />
        </div>
      </div>
    </div>
  )
}

// Demo data for development
function createDemoData(gameId: string): LiveDashboardData {
  return {
    game: {
      gameId,
      homeTeam: {
        id: 'Lakers',
        name: 'Los Angeles Lakers',
        abbreviation: 'LAL',
        city: 'Los Angeles'
      },
      awayTeam: {
        id: 'Warriors',
        name: 'Golden State Warriors',
        abbreviation: 'GSW',
        city: 'Golden State'
      },
      homeScore: 102,
      awayScore: 98,
      period: 4,
      gameClockSeconds: 154,
      gameStatus: 'LIVE',
      startTime: new Date().toISOString(),
      homeStats: {
        gameId,
        teamId: 'Lakers',
        opponentTeamId: 'Warriors',
        period: 4,
        points: 102,
        fieldGoalsMade: 39,
        fieldGoalsAttempted: 82,
        threePointersMade: 12,
        threePointersAttempted: 31,
        freeThrowsMade: 12,
        freeThrowsAttempted: 15,
        rebounds: 44,
        offensiveRebounds: 8,
        assists: 24,
        steals: 9,
        blocks: 4,
        turnovers: 13,
        personalFouls: 18,
        pace: 98.5,
        offensiveRating: 112.3,
        defensiveRating: 108.1,
        effectiveFieldGoalPercentage: 54.9,
        turnoverRate: 13.8,
        reboundRate: 52.4,
        lastUpdated: new Date().toISOString()
      },
      awayStats: {
        gameId,
        teamId: 'Warriors',
        opponentTeamId: 'Lakers',
        period: 4,
        points: 98,
        fieldGoalsMade: 36,
        fieldGoalsAttempted: 78,
        threePointersMade: 15,
        threePointersAttempted: 38,
        freeThrowsMade: 11,
        freeThrowsAttempted: 13,
        rebounds: 40,
        offensiveRebounds: 6,
        assists: 28,
        steals: 7,
        blocks: 6,
        turnovers: 11,
        personalFouls: 15,
        pace: 98.5,
        offensiveRating: 108.0,
        defensiveRating: 112.3,
        effectiveFieldGoalPercentage: 55.8,
        turnoverRate: 11.2,
        reboundRate: 47.6,
        lastUpdated: new Date().toISOString()
      },
      winProbability: {
        gameId,
        timestamp: new Date().toISOString(),
        homeTeamId: 'Lakers',
        awayTeamId: 'Warriors',
        homeWinProbability: 0.72,
        awayWinProbability: 0.28,
        confidence: 0.85,
        scoreDifferential: 4,
        timeRemaining: 154,
        homeTeamOffensiveRating: 112.3,
        homeTeamDefensiveRating: 108.1,
        awayTeamOffensiveRating: 108.0,
        awayTeamDefensiveRating: 112.3,
        momentumIndicator: 0.3
      }
    },
    recentEvents: [],
    topPerformers: {
      home: [],
      away: []
    },
    keyMetrics: {
      pace: 98.5,
      leadChanges: 8,
      biggestLead: 12,
      timeOfBiggestLead: new Date().toISOString()
    }
  }
}
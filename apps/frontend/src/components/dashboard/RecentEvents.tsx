'use client'

import { GameEvent } from '@/types'

interface RecentEventsProps {
  events: GameEvent[]
}

export default function RecentEvents({ events }: RecentEventsProps) {
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'SHOT_MADE': return '🏀'
      case 'SHOT_MISSED': return '❌'
      case 'FREE_THROW_MADE': return '🎯'
      case 'FREE_THROW_MISSED': return '😞'
      case 'REBOUND_OFFENSIVE': return '💪'
      case 'REBOUND_DEFENSIVE': return '🛡️'
      case 'ASSIST': return '🤝'
      case 'STEAL': return '👀'
      case 'BLOCK': return '🚫'
      case 'TURNOVER': return '💥'
      case 'FOUL_PERSONAL': return '⚠️'
      case 'TIMEOUT': return '⏸️'
      default: return '📝'
    }
  }

  const getEventDescription = (event: GameEvent) => {
    const player = event.playerId || 'Player'
    
    switch (event.eventType) {
      case 'SHOT_MADE':
        return `${player} made ${event.shotType} (${event.shotDistance}ft)`
      case 'SHOT_MISSED':
        return `${player} missed ${event.shotType} (${event.shotDistance}ft)`
      case 'FREE_THROW_MADE':
        return `${player} made free throw`
      case 'FREE_THROW_MISSED':
        return `${player} missed free throw`
      case 'REBOUND_OFFENSIVE':
        return `${player} offensive rebound`
      case 'REBOUND_DEFENSIVE':
        return `${player} defensive rebound`
      case 'ASSIST':
        return `${player} assist`
      case 'STEAL':
        return `${player} steal`
      case 'BLOCK':
        return `${player} block`
      case 'TURNOVER':
        return `${player} turnover`
      case 'FOUL_PERSONAL':
        return `${player} personal foul`
      case 'TIMEOUT':
        return `${event.teamId} timeout`
      default:
        return `${event.eventType.toLowerCase()}`
    }
  }

  const getEventColor = (event: GameEvent) => {
    switch (event.eventType) {
      case 'SHOT_MADE':
      case 'FREE_THROW_MADE':
      case 'ASSIST':
        return 'text-green-400'
      case 'SHOT_MISSED':
      case 'FREE_THROW_MISSED':
      case 'TURNOVER':
        return 'text-red-400'
      case 'STEAL':
      case 'BLOCK':
        return 'text-blue-400'
      case 'REBOUND_OFFENSIVE':
      case 'REBOUND_DEFENSIVE':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatGameTime = (period: number, gameClockSeconds: number) => {
    const periodDisplay = period <= 4 ? `Q${period}` : `OT${period - 4}`
    const minutes = Math.floor(gameClockSeconds / 60)
    const seconds = gameClockSeconds % 60
    return `${periodDisplay} ${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Create demo events if none exist
  const createDemoEvents = (): GameEvent[] => [
    {
      id: 'demo-1',
      gameId: 'demo',
      timestamp: new Date(Date.now() - 30000).toISOString(),
      gameClockSeconds: 180,
      period: 4,
      eventType: 'SHOT_MADE',
      playerId: 'Player_1',
      teamId: 'Lakers',
      opponentTeamId: 'Warriors',
      shotType: '3PT',
      shotDistance: 25,
      homeScore: 102,
      awayScore: 98,
    },
    {
      id: 'demo-2',
      gameId: 'demo',
      timestamp: new Date(Date.now() - 45000).toISOString(),
      gameClockSeconds: 195,
      period: 4,
      eventType: 'STEAL',
      playerId: 'Player_2',
      teamId: 'Warriors',
      opponentTeamId: 'Lakers',
      homeScore: 99,
      awayScore: 98,
    },
    {
      id: 'demo-3',
      gameId: 'demo',
      timestamp: new Date(Date.now() - 60000).toISOString(),
      gameClockSeconds: 210,
      period: 4,
      eventType: 'SHOT_MISSED',
      playerId: 'Player_3',
      teamId: 'Lakers',
      opponentTeamId: 'Warriors',
      shotType: '2PT',
      shotDistance: 15,
      homeScore: 99,
      awayScore: 98,
    },
    {
      id: 'demo-4',
      gameId: 'demo',
      timestamp: new Date(Date.now() - 75000).toISOString(),
      gameClockSeconds: 225,
      period: 4,
      eventType: 'REBOUND_DEFENSIVE',
      playerId: 'Player_4',
      teamId: 'Warriors',
      opponentTeamId: 'Lakers',
      homeScore: 99,
      awayScore: 98,
    },
  ]

  const displayEvents = events.length > 0 ? events.slice(0, 10) : createDemoEvents()

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">⚡ Recent Events</h3>
        <div className="text-sm text-gray-400">Live play-by-play</div>
      </div>
      
      <div className="card-content">
        {displayEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🏀</div>
            <div>No recent events</div>
            <div className="text-sm">Events will appear here during live games</div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {displayEvents.map((event, index) => (
              <div 
                key={event.id}
                className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  index === 0 ? 'bg-basketball-orange/10 border border-basketball-orange/20' : 
                  'bg-gray-750 hover:bg-gray-700'
                }`}
              >
                <div className="text-xl flex-shrink-0">
                  {getEventIcon(event.eventType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={`font-medium ${getEventColor(event)} truncate`}>
                    {getEventDescription(event)}
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-gray-400">
                      {formatGameTime(event.period, event.gameClockSeconds)}
                    </div>
                    <div className="text-xs font-mono text-gray-500">
                      {event.homeScore}-{event.awayScore}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          {events.length === 0 ? 
            "Demo events shown - live events will stream here during games" :
            `Showing last ${displayEvents.length} events`
          }
        </div>
      </div>
    </div>
  )
}
'use client'

import type { PlayerStats as PlayerStatsType, Team } from '@/types'

interface PlayerStatsProps {
  homePerformers: PlayerStatsType[]
  awayPerformers: PlayerStatsType[]
  homeTeam: Team
  awayTeam: Team
}

export default function PlayerStats({ homePerformers, awayPerformers, homeTeam, awayTeam }: PlayerStatsProps) {
  const PlayerCard = ({ player, teamColor }: { player: PlayerStatsType, teamColor: string }) => (
    <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{player.playerId}</div>
          <div className="text-xs text-gray-400">{player.minutesPlayed.toFixed(1)} MIN</div>
        </div>
        <div className={`text-2xl font-bold ${teamColor}`}>
          {player.points}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="text-center">
          <div className="font-semibold">{player.rebounds}</div>
          <div className="text-gray-400">REB</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">{player.assists}</div>
          <div className="text-gray-400">AST</div>
        </div>
        <div className="text-center">
          <div className="font-semibold">
            {player.fieldGoalsAttempted > 0 ? 
              Math.round((player.fieldGoalsMade / player.fieldGoalsAttempted) * 100) : 0}%
          </div>
          <div className="text-gray-400">FG%</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">FGM-FGA:</span>
          <span>{player.fieldGoalsMade}-{player.fieldGoalsAttempted}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">3PM-3PA:</span>
          <span>{player.threePointersMade}-{player.threePointersAttempted}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">FTM-FTA:</span>
          <span>{player.freeThrowsMade}-{player.freeThrowsAttempted}</span>
        </div>
      </div>

      {player.trueShootingPercentage > 0 && (
        <div className="mt-2 text-center">
          <div className="text-xs text-gray-400">True Shooting</div>
          <div className="font-semibold text-basketball-orange">
            {player.trueShootingPercentage.toFixed(1)}%
          </div>
        </div>
      )}
    </div>
  )

  // Create demo players if none exist
  const createDemoPlayers = (teamId: string, count: number = 5): PlayerStatsType[] => {
    return Array.from({ length: count }, (_, i) => ({
      gameId: 'demo',
      playerId: `${teamId}_Player_${i + 1}`,
      teamId,
      minutesPlayed: Math.random() * 30 + 15,
      points: Math.floor(Math.random() * 25) + 5,
      fieldGoalsMade: Math.floor(Math.random() * 8) + 2,
      fieldGoalsAttempted: Math.floor(Math.random() * 12) + 5,
      threePointersMade: Math.floor(Math.random() * 4),
      threePointersAttempted: Math.floor(Math.random() * 6) + 1,
      freeThrowsMade: Math.floor(Math.random() * 4),
      freeThrowsAttempted: Math.floor(Math.random() * 5),
      rebounds: Math.floor(Math.random() * 8) + 1,
      offensiveRebounds: Math.floor(Math.random() * 3),
      assists: Math.floor(Math.random() * 6),
      steals: Math.floor(Math.random() * 3),
      blocks: Math.floor(Math.random() * 2),
      turnovers: Math.floor(Math.random() * 4),
      personalFouls: Math.floor(Math.random() * 4),
      playerImpactEstimate: Math.random() * 20 - 10,
      usageRate: Math.random() * 30 + 15,
      trueShootingPercentage: Math.random() * 30 + 45,
      lastUpdated: new Date().toISOString(),
    }))
  }

  const displayHomePerformers = homePerformers.length > 0 ? 
    homePerformers.slice(0, 5) : 
    createDemoPlayers(homeTeam.id)

  const displayAwayPerformers = awayPerformers.length > 0 ? 
    awayPerformers.slice(0, 5) : 
    createDemoPlayers(awayTeam.id)

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">⭐ Top Performers</h3>
      </div>
      
      <div className="card-content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Home Team Players */}
          <div>
            <div className="flex items-center mb-4">
              <h4 className="font-semibold text-blue-400">{homeTeam.name}</h4>
              <div className="ml-2 px-2 py-1 bg-blue-900/50 rounded text-xs">HOME</div>
            </div>
            <div className="space-y-3">
              {displayHomePerformers.map((player, index) => (
                <PlayerCard 
                  key={player.playerId} 
                  player={player} 
                  teamColor="text-blue-400" 
                />
              ))}
            </div>
          </div>

          {/* Away Team Players */}
          <div>
            <div className="flex items-center mb-4">
              <h4 className="font-semibold text-red-400">{awayTeam.name}</h4>
              <div className="ml-2 px-2 py-1 bg-red-900/50 rounded text-xs">AWAY</div>
            </div>
            <div className="space-y-3">
              {displayAwayPerformers.map((player, index) => (
                <PlayerCard 
                  key={player.playerId} 
                  player={player} 
                  teamColor="text-red-400" 
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="text-xs text-gray-500">
            Showing top 5 performers by points scored
          </div>
          {homePerformers.length === 0 && awayPerformers.length === 0 && (
            <div className="text-xs text-yellow-400 mt-1">
              Demo data - actual player stats will appear when games are active
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
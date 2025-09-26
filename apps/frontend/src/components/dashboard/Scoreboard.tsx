'use client'

import { GameSummary } from '@/types'
import { formatGameClock } from '@/utils'

interface ScoreboardProps {
  game: GameSummary
}

export default function Scoreboard({ game }: ScoreboardProps) {
  const periodDisplay = game.period <= 4 ? `Q${game.period}` : `OT${game.period - 4}`
  
  return (
    <div className="card">
      <div className="card-content">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Home Team */}
          <div className="text-center md:text-left">
            <div className="team-colors-home rounded-lg p-6 text-white">
              <div className="text-sm font-medium opacity-90">HOME</div>
              <div className="text-2xl font-bold mb-2">{game.homeTeam.name}</div>
              <div className="text-4xl md:text-6xl font-black text-shadow">
                {game.homeScore}
              </div>
            </div>
          </div>

          {/* Game Clock & Status */}
          <div className="text-center">
            <div className="mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                game.gameStatus === 'LIVE' ? 'bg-red-100 text-red-800 animate-pulse' :
                game.gameStatus === 'FINAL' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {game.gameStatus}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-mono font-bold">
                {formatGameClock(game.gameClockSeconds)}
              </div>
              <div className="text-lg font-semibold text-basketball-orange">
                {periodDisplay}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-400">
              Started {new Date(game.startTime).toLocaleTimeString()}
            </div>
          </div>

          {/* Away Team */}
          <div className="text-center md:text-right">
            <div className="team-colors-away rounded-lg p-6 text-white">
              <div className="text-sm font-medium opacity-90">AWAY</div>
              <div className="text-2xl font-bold mb-2">{game.awayTeam.name}</div>
              <div className="text-4xl md:text-6xl font-black text-shadow">
                {game.awayScore}
              </div>
            </div>
          </div>
        </div>

        {/* Score Differential */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-400">
            {game.homeScore > game.awayScore ? (
              <span className="text-blue-400">
                {game.homeTeam.abbreviation} leads by {game.homeScore - game.awayScore}
              </span>
            ) : game.awayScore > game.homeScore ? (
              <span className="text-red-400">
                {game.awayTeam.abbreviation} leads by {game.awayScore - game.homeScore}
              </span>
            ) : (
              <span className="text-yellow-400">Game tied</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
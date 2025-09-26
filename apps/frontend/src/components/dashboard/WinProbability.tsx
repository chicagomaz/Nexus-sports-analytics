'use client'

import { WinProbabilityPrediction } from '@/types'

interface WinProbabilityProps {
  prediction: WinProbabilityPrediction
}

export default function WinProbability({ prediction }: WinProbabilityProps) {
  const homeWinPercentage = Math.round(prediction.homeWinProbability * 100)
  const awayWinPercentage = Math.round(prediction.awayWinProbability * 100)
  
  const getMomentumColor = (momentum: number) => {
    if (momentum > 0.3) return 'text-green-400'
    if (momentum < -0.3) return 'text-red-400'
    return 'text-yellow-400'
  }

  const getMomentumText = (momentum: number) => {
    if (momentum > 0.3) return 'Strong Positive'
    if (momentum > 0.1) return 'Positive'
    if (momentum < -0.3) return 'Strong Negative'
    if (momentum < -0.1) return 'Negative'
    return 'Neutral'
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold flex items-center">
          🎯 Win Probability
          <span className="ml-2 text-sm font-normal text-gray-400">
            ({Math.round(prediction.confidence * 100)}% confidence)
          </span>
        </h3>
      </div>
      
      <div className="card-content">
        {/* Probability Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Home Team</span>
            <span className="text-sm font-medium">Away Team</span>
          </div>
          
          <div className="win-probability-bar">
            <div 
              className="probability-fill bg-gradient-to-r from-blue-500 to-blue-600"
              style={{ width: `${homeWinPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-bold text-blue-400">{homeWinPercentage}%</span>
            <span className="text-2xl font-bold text-red-400">{awayWinPercentage}%</span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card">
            <div className="stat-value">{prediction.scoreDifferential > 0 ? '+' : ''}{prediction.scoreDifferential}</div>
            <div className="stat-label">Score Differential</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">
              {Math.floor(prediction.timeRemaining / 60)}:{String(prediction.timeRemaining % 60).padStart(2, '0')}
            </div>
            <div className="stat-label">Time Remaining</div>
          </div>
          
          <div className="stat-card">
            <div className={`stat-value ${getMomentumColor(prediction.momentumIndicator)}`}>
              {getMomentumText(prediction.momentumIndicator)}
            </div>
            <div className="stat-label">Momentum</div>
          </div>
        </div>

        {/* Team Ratings Comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-blue-400">Home Team Ratings</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Offensive Rating</span>
                <span className="font-mono">{prediction.homeTeamOffensiveRating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Defensive Rating</span>
                <span className="font-mono">{prediction.homeTeamDefensiveRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-red-400">Away Team Ratings</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Offensive Rating</span>
                <span className="font-mono">{prediction.awayTeamOffensiveRating.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Defensive Rating</span>
                <span className="font-mono">{prediction.awayTeamDefensiveRating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {new Date(prediction.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
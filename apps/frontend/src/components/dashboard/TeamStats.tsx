'use client'

import { GameStats, Team } from '@/types'
import { formatPercentage } from '@/utils'

interface TeamStatsProps {
  homeStats: GameStats
  awayStats: GameStats
  homeTeam: Team
  awayTeam: Team
}

export default function TeamStats({ homeStats, awayStats, homeTeam, awayTeam }: TeamStatsProps) {
  const StatRow = ({ 
    label, 
    homeValue, 
    awayValue, 
    format = 'number',
    isGoodHigh = true 
  }: {
    label: string
    homeValue: number
    awayValue: number
    format?: 'number' | 'percentage'
    isGoodHigh?: boolean
  }) => {
    const formatValue = (value: number) => {
      if (format === 'percentage') return formatPercentage(value)
      return value.toFixed(1)
    }

    const getComparisonColor = (home: number, away: number, isHome: boolean) => {
      const isHomeBetter = isGoodHigh ? home > away : home < away
      const isAwayBetter = isGoodHigh ? away > home : away < home
      
      if (isHome) {
        if (isHomeBetter) return 'text-green-400'
        if (isAwayBetter) return 'text-red-400'
      } else {
        if (isAwayBetter) return 'text-green-400'
        if (isHomeBetter) return 'text-red-400'
      }
      return 'text-gray-300'
    }

    return (
      <div className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
        <div className={`text-right w-20 ${getComparisonColor(homeValue, awayValue, true)}`}>
          {formatValue(homeValue)}
        </div>
        <div className="text-center flex-1 text-sm text-gray-400 font-medium">
          {label}
        </div>
        <div className={`text-left w-20 ${getComparisonColor(homeValue, awayValue, false)}`}>
          {formatValue(awayValue)}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">📊 Team Statistics</h3>
      </div>
      
      <div className="card-content">
        {/* Team Headers */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
          <div className="text-center w-20">
            <div className="font-semibold text-blue-400">{homeTeam.abbreviation}</div>
            <div className="text-xs text-gray-400">HOME</div>
          </div>
          <div className="text-center flex-1">
            <div className="text-sm font-medium text-gray-400">STATISTICS</div>
          </div>
          <div className="text-center w-20">
            <div className="font-semibold text-red-400">{awayTeam.abbreviation}</div>
            <div className="text-xs text-gray-400">AWAY</div>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">SCORING</h4>
          <StatRow 
            label="Field Goals" 
            homeValue={homeStats.fieldGoalsMade} 
            awayValue={awayStats.fieldGoalsMade} 
          />
          <StatRow 
            label="FG%" 
            homeValue={homeStats.fieldGoalsAttempted > 0 ? (homeStats.fieldGoalsMade / homeStats.fieldGoalsAttempted) * 100 : 0} 
            awayValue={awayStats.fieldGoalsAttempted > 0 ? (awayStats.fieldGoalsMade / awayStats.fieldGoalsAttempted) * 100 : 0}
            format="percentage"
          />
          <StatRow 
            label="3-Pointers" 
            homeValue={homeStats.threePointersMade} 
            awayValue={awayStats.threePointersMade} 
          />
          <StatRow 
            label="3P%" 
            homeValue={homeStats.threePointersAttempted > 0 ? (homeStats.threePointersMade / homeStats.threePointersAttempted) * 100 : 0} 
            awayValue={awayStats.threePointersAttempted > 0 ? (awayStats.threePointersMade / awayStats.threePointersAttempted) * 100 : 0}
            format="percentage"
          />
          <StatRow 
            label="Free Throws" 
            homeValue={homeStats.freeThrowsMade} 
            awayValue={awayStats.freeThrowsMade} 
          />
        </div>

        {/* Other Stats */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">TEAM PLAY</h4>
          <StatRow 
            label="Rebounds" 
            homeValue={homeStats.rebounds} 
            awayValue={awayStats.rebounds} 
          />
          <StatRow 
            label="Assists" 
            homeValue={homeStats.assists} 
            awayValue={awayStats.assists} 
          />
          <StatRow 
            label="Steals" 
            homeValue={homeStats.steals} 
            awayValue={awayStats.steals} 
          />
          <StatRow 
            label="Blocks" 
            homeValue={homeStats.blocks} 
            awayValue={awayStats.blocks} 
          />
          <StatRow 
            label="Turnovers" 
            homeValue={homeStats.turnovers} 
            awayValue={awayStats.turnovers}
            isGoodHigh={false}
          />
        </div>

        {/* Advanced Stats */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3">ADVANCED METRICS</h4>
          <StatRow 
            label="Pace" 
            homeValue={homeStats.pace} 
            awayValue={awayStats.pace} 
          />
          <StatRow 
            label="Offensive Rating" 
            homeValue={homeStats.offensiveRating} 
            awayValue={awayStats.offensiveRating} 
          />
          <StatRow 
            label="Defensive Rating" 
            homeValue={homeStats.defensiveRating} 
            awayValue={awayStats.defensiveRating}
            isGoodHigh={false}
          />
          <StatRow 
            label="Effective FG%" 
            homeValue={homeStats.effectiveFieldGoalPercentage} 
            awayValue={awayStats.effectiveFieldGoalPercentage}
            format="percentage"
          />
          <StatRow 
            label="Turnover Rate" 
            homeValue={homeStats.turnoverRate} 
            awayValue={awayStats.turnoverRate}
            format="percentage"
            isGoodHigh={false}
          />
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Last updated: {new Date(homeStats.lastUpdated).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
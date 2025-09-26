'use client'

interface KeyMetricsProps {
  metrics: {
    pace: number
    leadChanges: number
    biggestLead: number
    timeOfBiggestLead: string
  }
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-lg font-semibold">📈 Key Metrics</h3>
      </div>
      
      <div className="card-content">
        <div className="space-y-4">
          <div className="stat-card bg-gradient-to-r from-purple-600 to-purple-700">
            <div className="stat-value text-white">{metrics.pace.toFixed(1)}</div>
            <div className="stat-label text-purple-100">Game Pace</div>
            <div className="text-xs text-purple-200 mt-1">Possessions per game</div>
          </div>
          
          <div className="stat-card bg-gradient-to-r from-green-600 to-green-700">
            <div className="stat-value text-white">{metrics.leadChanges}</div>
            <div className="stat-label text-green-100">Lead Changes</div>
            <div className="text-xs text-green-200 mt-1">Times score lead switched</div>
          </div>
          
          <div className="stat-card bg-gradient-to-r from-yellow-600 to-yellow-700">
            <div className="stat-value text-white">{metrics.biggestLead}</div>
            <div className="stat-label text-yellow-100">Biggest Lead</div>
            <div className="text-xs text-yellow-200 mt-1">
              At {new Date(metrics.timeOfBiggestLead).toLocaleTimeString()}
            </div>
          </div>
          
          {/* Additional Insight Cards */}
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-basketball-orange mb-2">Game Flow</h4>
            <div className="text-sm text-gray-300">
              {metrics.pace > 100 ? 
                "🏃‍♂️ Fast-paced game with frequent possessions" :
                metrics.pace > 95 ?
                "⚡ Moderate pace with balanced play" :
                "🐌 Slower pace with controlled possessions"
              }
            </div>
          </div>

          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-basketball-orange mb-2">Competitiveness</h4>
            <div className="text-sm text-gray-300">
              {metrics.leadChanges > 10 ? 
                "🔥 Highly competitive back-and-forth game" :
                metrics.leadChanges > 5 ?
                "⚔️ Competitive with multiple lead changes" :
                "📈 One team maintaining control"
              }
            </div>
          </div>
          
          <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-basketball-orange mb-2">Game State</h4>
            <div className="text-sm text-gray-300">
              {metrics.biggestLead > 15 ? 
                "💥 Blowout potential - large lead established" :
                metrics.biggestLead > 8 ?
                "📊 Significant lead but still competitive" :
                "🎯 Close game throughout"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
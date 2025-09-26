'use client'

import { useState, useEffect } from 'react'

interface ModelScenario {
  homeScore: number
  awayScore: number
  timeRemaining: number
  period: number
  homeOffRating: number
  homeDefRating: number
  awayOffRating: number
  awayDefRating: number
  momentumFactor: number
}

interface PredictionResult {
  homeWinProbability: number
  awayWinProbability: number
  confidence: number
  keyFactors: Array<{
    factor: string
    impact: number
    description: string
  }>
}

export default function MLExplorerPage() {
  const [scenario, setScenario] = useState<ModelScenario>({
    homeScore: 98,
    awayScore: 94,
    timeRemaining: 300, // 5 minutes in seconds
    period: 4,
    homeOffRating: 112.5,
    homeDefRating: 108.2,
    awayOffRating: 110.1,
    awayDefRating: 109.8,
    momentumFactor: 0.2
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('ensemble')

  const models = [
    { id: 'ensemble', name: 'Ensemble Model', description: 'Combined Random Forest + XGBoost + Neural Network' },
    { id: 'neural', name: 'Deep Neural Network', description: 'Multi-layer perceptron with attention mechanism' },
    { id: 'xgboost', name: 'XGBoost', description: 'Gradient boosting with feature importance' },
    { id: 'random-forest', name: 'Random Forest', description: 'Ensemble of decision trees' }
  ]

  // Simulate ML prediction based on scenario
  const calculatePrediction = async () => {
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const scoreDiff = scenario.homeScore - scenario.awayScore
    const timeWeight = scenario.timeRemaining / 2880 // Normalize to 0-1
    const ratingDiff = (scenario.homeOffRating - scenario.awayDefRating) - (scenario.awayOffRating - scenario.homeDefRating)
    
    // Simple prediction algorithm for demo
    let baseProbability = 0.5 + (scoreDiff * 0.05) + (ratingDiff * 0.02) + (scenario.momentumFactor * 0.3)
    baseProbability += (1 - timeWeight) * 0.2 // Less time = more certain
    
    // Clamp between 0.05 and 0.95
    baseProbability = Math.max(0.05, Math.min(0.95, baseProbability))
    
    const confidence = 0.65 + (Math.abs(0.5 - baseProbability) * 0.7)
    
    const keyFactors = [
      {
        factor: 'Score Differential',
        impact: Math.abs(scoreDiff) * 0.1,
        description: `${Math.abs(scoreDiff)} point ${scoreDiff > 0 ? 'lead for home team' : 'deficit for home team'}`
      },
      {
        factor: 'Time Remaining', 
        impact: timeWeight * 0.3,
        description: `${Math.floor(scenario.timeRemaining / 60)}:${(scenario.timeRemaining % 60).toString().padStart(2, '0')} left in period ${scenario.period}`
      },
      {
        factor: 'Offensive Efficiency',
        impact: Math.abs(ratingDiff) * 0.01,
        description: `${ratingDiff > 0 ? 'Home team' : 'Away team'} has ${Math.abs(ratingDiff).toFixed(1)} rating advantage`
      },
      {
        factor: 'Momentum',
        impact: Math.abs(scenario.momentumFactor) * 0.4,
        description: `${scenario.momentumFactor > 0 ? 'Positive' : 'Negative'} momentum (${(scenario.momentumFactor * 100).toFixed(0)}%)`
      }
    ]
    
    setPrediction({
      homeWinProbability: baseProbability,
      awayWinProbability: 1 - baseProbability,
      confidence,
      keyFactors: keyFactors.sort((a, b) => b.impact - a.impact)
    })
    
    setLoading(false)
  }

  useEffect(() => {
    calculatePrediction()
  }, [scenario, selectedModel])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-blue-400 rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h1 className="text-4xl font-orbitron font-bold text-white">AI Model Explorer</h1>
            <p className="text-gray-400 font-rajdhani">Interactive machine learning prediction engine</p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="card p-6 mb-8">
          <h3 className="text-lg font-orbitron font-bold text-white mb-4">Select ML Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`p-4 rounded-lg border transition-all ${
                  selectedModel === model.id
                    ? 'border-blue-400 bg-blue-400/10 text-blue-400'
                    : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-rajdhani font-semibold text-sm mb-1">{model.name}</div>
                <div className="text-xs text-gray-400">{model.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scenario Builder */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-orbitron font-bold text-white">Game Scenario</h2>
              <p className="text-gray-400 font-rajdhani text-sm">Adjust parameters to see how predictions change</p>
            </div>
            <div className="card-content space-y-6">
              {/* Score */}
              <div>
                <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-3">Score</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Home Team</label>
                    <input
                      type="number"
                      value={scenario.homeScore}
                      onChange={(e) => setScenario({...scenario, homeScore: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-xl font-orbitron font-bold focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Away Team</label>
                    <input
                      type="number"
                      value={scenario.awayScore}
                      onChange={(e) => setScenario({...scenario, awayScore: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-center text-xl font-orbitron font-bold focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Time and Period */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">Time Remaining (seconds)</label>
                  <input
                    type="range"
                    min="0"
                    max="720"
                    value={scenario.timeRemaining}
                    onChange={(e) => setScenario({...scenario, timeRemaining: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="text-center text-blue-400 font-orbitron font-bold mt-2">
                    {formatTime(scenario.timeRemaining)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">Period</label>
                  <select
                    value={scenario.period}
                    onChange={(e) => setScenario({...scenario, period: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                  >
                    <option value={1}>1st Quarter</option>
                    <option value={2}>2nd Quarter</option>
                    <option value={3}>3rd Quarter</option>
                    <option value={4}>4th Quarter</option>
                    <option value={5}>Overtime</option>
                  </select>
                </div>
              </div>

              {/* Ratings */}
              <div>
                <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-3">Team Efficiency Ratings</label>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Home Offensive Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={scenario.homeOffRating}
                        onChange={(e) => setScenario({...scenario, homeOffRating: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Home Defensive Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={scenario.homeDefRating}
                        onChange={(e) => setScenario({...scenario, homeDefRating: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Away Offensive Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={scenario.awayOffRating}
                        onChange={(e) => setScenario({...scenario, awayOffRating: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Away Defensive Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={scenario.awayDefRating}
                        onChange={(e) => setScenario({...scenario, awayDefRating: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Momentum */}
              <div>
                <label className="block text-sm font-rajdhani font-medium text-gray-300 mb-2">Momentum Factor</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={scenario.momentumFactor}
                  onChange={(e) => setScenario({...scenario, momentumFactor: parseFloat(e.target.value)})}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Away Momentum</span>
                  <span className={`font-orbitron font-bold ${scenario.momentumFactor > 0 ? 'text-green-400' : scenario.momentumFactor < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {(scenario.momentumFactor * 100).toFixed(0)}%
                  </span>
                  <span>Home Momentum</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Results */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-orbitron font-bold text-white">AI Prediction</h2>
              <p className="text-gray-400 font-rajdhani text-sm">Model: {models.find(m => m.id === selectedModel)?.name}</p>
            </div>
            <div className="card-content">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  <span className="ml-3 text-gray-300">Computing prediction...</span>
                </div>
              ) : prediction ? (
                <div className="space-y-6">
                  {/* Win Probability */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-rajdhani font-medium text-gray-300">Home Win Probability</span>
                      <span className="font-orbitron font-bold text-2xl text-blue-400">
                        {(prediction.homeWinProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="win-probability-bar mb-4">
                      <div
                        className="probability-fill bg-gradient-to-r from-blue-500 to-blue-400"
                        style={{ width: `${prediction.homeWinProbability * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-rajdhani font-medium text-gray-300">Away Win Probability</span>
                      <span className="font-orbitron font-bold text-2xl text-red-400">
                        {(prediction.awayWinProbability * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-rajdhani font-medium text-gray-300">Model Confidence</span>
                      <span className="font-orbitron font-bold text-lg text-green-400">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Key Factors */}
          {prediction && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-orbitron font-bold text-white">Key Prediction Factors</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  {prediction.keyFactors.map((factor, index) => (
                    <div key={factor.factor} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-rajdhani font-semibold text-white">{factor.factor}</span>
                        <span className="text-sm font-orbitron font-bold text-basketball-orange">
                          {(factor.impact * 100).toFixed(1)}% impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-rajdhani">{factor.description}</p>
                      <div className="mt-2 h-1 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-gradient-to-r from-basketball-orange to-yellow-400 rounded-full"
                          style={{ width: `${factor.impact * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import GameList from '@/components/GameList'
import GameDashboard from '@/components/GameDashboard'

export default function LiveGamesPage() {
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId)
  }

  const handleBackToList = () => {
    setSelectedGameId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
      {!selectedGameId ? (
        <div>
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-orbitron font-bold text-white">Live Games</h1>
                <p className="text-gray-400 font-rajdhani">Real-time NBA analytics and predictions</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="live-indicator">
                <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                LIVE DATA STREAM
              </div>
              <div className="text-sm text-gray-400 font-rajdhani">
                Updated every second
              </div>
            </div>
          </div>

          <GameList onGameSelect={handleGameSelect} />
        </div>
      ) : (
        <div>
          <button
            onClick={handleBackToList}
            className="glass-button mb-8 group"
          >
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Back to Live Games
            </span>
          </button>
          <GameDashboard gameId={selectedGameId} />
        </div>
      )}
    </div>
  )
}
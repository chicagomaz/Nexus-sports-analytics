'use client'

import { useState, useEffect } from 'react'
import Navigation from './Navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(288) // 72 * 4 = 288px (w-72)

  useEffect(() => {
    const handleResize = () => {
      // Auto-collapse on mobile
      if (window.innerWidth < 768) {
        setSidebarWidth(80) // w-20
      } else {
        setSidebarWidth(288) // w-72
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex">
      <Navigation onWidthChange={setSidebarWidth} />
      
      <main 
        className="min-h-screen relative flex-1 transition-all duration-300"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="relative">
          {children}
          
          <footer className="relative bg-gradient-to-r from-gray-900/95 to-gray-800/95 border-t border-gray-700/50 backdrop-blur-lg mt-20">
            <div className="absolute inset-0 bg-gradient-to-r from-basketball-orange/5 via-transparent to-blue-500/5"></div>
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-basketball-orange to-yellow-500 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                    </div>
                    <span className="font-orbitron font-bold text-lg text-white">NEXUS</span>
                  </div>
                  <p className="text-gray-400 font-rajdhani text-sm">
                    Advanced real-time sports analytics powered by AI and cloud computing.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="font-orbitron font-bold text-white text-sm uppercase tracking-wider">Technology Stack</h3>
                  <div className="space-y-2 text-xs font-rajdhani text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-basketball-orange rounded-full"></div>
                      <span>AWS Lambda & Kinesis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-basketball-orange rounded-full"></div>
                      <span>Real-time WebSocket</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-basketball-orange rounded-full"></div>
                      <span>Next.js & TypeScript</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-orbitron font-bold text-white text-sm uppercase tracking-wider">Data Sources</h3>
                  <div className="space-y-2 text-xs font-rajdhani text-gray-400">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                      <span>Live NBA API Integration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span>Advanced ML Predictions</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                      <span>Historical Analytics</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800/50 mt-8 pt-8 text-center">
                <p className="text-gray-500 text-xs font-rajdhani">
                  &copy; 2024 NEXUS Analytics. Powered by cutting-edge sports intelligence technology.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  )
}
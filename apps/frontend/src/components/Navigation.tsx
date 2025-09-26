'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

interface NavigationProps {
  onWidthChange?: (width: number) => void
}

export default function Navigation({ onWidthChange }: NavigationProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (onWidthChange) {
      onWidthChange(isCollapsed ? 80 : 288) // w-20 : w-72
    }
  }, [isCollapsed, onWidthChange])

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠', description: 'Dashboard Home' },
    { href: '/live-games', label: 'Live Games', icon: '🔴', description: 'Real-time Analytics' },
    { href: '/historical', label: 'Game History', icon: '📚', description: 'Historical Analysis' },
    { href: '/ml-explorer', label: 'AI Explorer', icon: '🤖', description: 'Model Playground' },
  ]

  return (
    <nav className={`fixed left-0 top-0 h-full z-50 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      <div className="flex flex-col h-full">
        {/* Logo & Toggle */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <Link href="/" className={`flex items-center space-x-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-basketball-orange to-yellow-500 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-orbitron font-bold text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  NEXUS
                </span>
                <span className="text-xs font-rajdhani text-gray-400 uppercase tracking-wider">
                  Sports Intel
                </span>
              </div>
            </Link>
            
            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <div className={`w-4 h-4 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                <svg fill="currentColor" viewBox="0 0 20 20" className="text-gray-400">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6">
          <div className="space-y-2 px-4">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group relative flex items-center p-4 rounded-xl font-rajdhani font-medium transition-all duration-300
                    hover:scale-105 hover:shadow-lg
                    ${isActive 
                      ? 'bg-gradient-to-r from-basketball-orange/20 to-yellow-500/10 text-basketball-orange shadow-lg shadow-basketball-orange/20 border border-basketball-orange/30' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-gray-700 border border-transparent'
                    }
                  `}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideInLeft 0.5s ease-out forwards'
                  }}
                >
                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                    ${isActive 
                      ? 'bg-basketball-orange/20 text-basketball-orange' 
                      : 'bg-gray-800/50 group-hover:bg-gray-700/50 group-hover:scale-110'
                    }
                  `}>
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  {/* Label & Description */}
                  <div className={`ml-4 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                    <div className="font-semibold">{item.label}</div>
                    <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                      {item.description}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  <div className={`
                    absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-basketball-orange to-yellow-500 rounded-r-full transition-all duration-300
                    ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                  `} />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-basketball-orange/0 via-basketball-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Status Footer */}
        <div className="p-6 border-t border-gray-800/50">
          <div className={`flex items-center space-x-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50"></div>
            <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
              <div className="text-green-400 text-sm font-rajdhani font-semibold">System Online</div>
              <div className="text-xs text-gray-500">Real-time Active</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/live-games', label: 'Live Games', icon: '🔴' },
    { href: '/historical', label: 'Game History', icon: '📚' },
    { href: '/ml-explorer', label: 'AI Explorer', icon: '🤖' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-basketball-orange to-yellow-500 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              SPORTS INTEL
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg font-rajdhani font-medium transition-all duration-200
                    ${isActive 
                      ? 'bg-basketball-orange text-white shadow-lg shadow-basketball-orange/25' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <span className="hidden sm:inline">{item.icon} </span>
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 text-green-400">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-rajdhani">System Online</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
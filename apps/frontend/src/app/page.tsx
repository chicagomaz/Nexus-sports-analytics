import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-basketball-orange/10 via-transparent to-blue-500/10 blur-3xl"></div>
        <div className="relative">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-basketball-orange/10 border border-basketball-orange/20 text-basketball-orange text-sm font-rajdhani font-semibold uppercase tracking-wider mb-8">
            <div className="w-2 h-2 bg-basketball-orange rounded-full mr-2 animate-pulse"></div>
            Real-time Intelligence Active
          </div>
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              SPORTS
            </span>
            <br />
            <span className="bg-gradient-to-r from-basketball-orange via-yellow-400 to-basketball-orange bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-rajdhani font-light max-w-3xl mx-auto leading-relaxed">
            Advanced basketball analytics powered by cutting-edge AI, 
            machine learning, and cloud-native architecture
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
        <div className="stat-card group">
          <div className="stat-value">99.9%</div>
          <div className="stat-label">Uptime SLA</div>
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="stat-card group">
          <div className="stat-value">15ms</div>
          <div className="stat-label">Response Time</div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="stat-card group">
          <div className="stat-value">∞</div>
          <div className="stat-label">Scalable Processing</div>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div className="stat-card group">
          <div className="stat-value">AI</div>
          <div className="stat-label">ML Predictions</div>
          <div className="absolute inset-0 bg-gradient-to-br from-basketball-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <Link href="/live-games" className="feature-card group">
          <div className="feature-icon bg-red-500/20">
            <div className="w-6 h-6 bg-red-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="feature-title text-red-400">Live Games</h3>
          <p className="feature-description">
            Real-time analytics and predictions for ongoing NBA games with live win probability tracking
          </p>
          <div className="feature-arrow group-hover:translate-x-1 transition-transform">→</div>
        </Link>

        <Link href="/historical" className="feature-card group">
          <div className="feature-icon bg-purple-500/20">
            <div className="w-6 h-6 bg-purple-400 rounded-lg"></div>
          </div>
          <h3 className="feature-title text-purple-400">Game History</h3>
          <p className="feature-description">
            Explore historical matchups with advanced analytics and discover classic games and performances
          </p>
          <div className="feature-arrow group-hover:translate-x-1 transition-transform">→</div>
        </Link>

        <Link href="/ml-explorer" className="feature-card group">
          <div className="feature-icon bg-blue-500/20">
            <div className="w-6 h-6 bg-blue-400 rounded-sm transform rotate-45"></div>
          </div>
          <h3 className="feature-title text-blue-400">AI Explorer</h3>
          <p className="feature-description">
            Interactive machine learning model explorer with scenario testing and prediction confidence
          </p>
          <div className="feature-arrow group-hover:translate-x-1 transition-transform">→</div>
        </Link>
      </div>
      
      {/* Platform Capabilities Section */}
      <div className="mt-20 card-premium">
        <div className="card-header">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-basketball-orange to-yellow-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <h2 className="section-title text-2xl">Platform Capabilities</h2>
          </div>
          <p className="section-subtitle mt-2">Enterprise-grade sports analytics infrastructure</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/10 border border-blue-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="font-orbitron font-bold text-blue-400">Real-time Event Streaming</h3>
                </div>
                <p className="text-gray-300 font-rajdhani">
                  High-throughput event ingestion via AWS Kinesis with microsecond precision 
                  and automatic scaling capabilities
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-basketball-orange/5 to-yellow-500/10 border border-basketball-orange/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-basketball-orange/20 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-basketball-orange rounded-sm"></div>
                  </div>
                  <h3 className="font-orbitron font-bold text-basketball-orange">Advanced ML Models</h3>
                </div>
                <p className="text-gray-300 font-rajdhani">
                  Predictive analytics using ensemble machine learning models 
                  with continuous training and optimization
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/5 to-green-600/10 border border-green-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-green-400 rounded-full"></div>
                  </div>
                  <h3 className="font-orbitron font-bold text-green-400">Cloud-native Architecture</h3>
                </div>
                <p className="text-gray-300 font-rajdhani">
                  Serverless infrastructure with auto-scaling, fault tolerance, 
                  and multi-region deployment capabilities
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-600/10 border border-purple-500/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <div className="w-5 h-5 bg-purple-400 rounded-full"></div>
                  </div>
                  <h3 className="font-orbitron font-bold text-purple-400">Historical Analytics</h3>
                </div>
                <p className="text-gray-300 font-rajdhani">
                  Petabyte-scale data lake with advanced querying and trend analysis 
                  for comprehensive insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
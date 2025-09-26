import { LiveDashboardData } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

class ApiService {
  private async fetchApi(endpoint: string, options?: RequestInit) {
    const url = `${API_BASE_URL}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request to ${url} failed:`, error)
      throw error
    }
  }

  // Game-related endpoints
  async getGames() {
    return this.fetchApi('/games')
  }

  async getGameSummary(gameId: string) {
    return this.fetchApi(`/games/${gameId}`)
  }

  async getGameStats(gameId: string) {
    return this.fetchApi(`/games/${gameId}/stats`)
  }

  async getLiveDashboard(gameId: string): Promise<LiveDashboardData> {
    return this.fetchApi(`/games/${gameId}/dashboard`)
  }

  async getGameEvents(gameId: string, limit?: number, offset?: number) {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    
    const query = params.toString() ? `?${params.toString()}` : ''
    return this.fetchApi(`/games/${gameId}/events${query}`)
  }

  // Event ingestion endpoints
  async sendEvent(event: any) {
    return this.fetchApi('/events', {
      method: 'POST',
      body: JSON.stringify({
        action: 'send_event',
        event,
      }),
    })
  }

  async simulateGame(gameId: string, homeTeamId: string, awayTeamId: string, durationMinutes?: number) {
    return this.fetchApi('/events', {
      method: 'POST',
      body: JSON.stringify({
        action: 'simulate_game',
        gameId,
        homeTeamId,
        awayTeamId,
        durationMinutes,
      }),
    })
  }

  async simulateEvents(
    gameId: string, 
    homeTeamId: string, 
    awayTeamId: string, 
    eventCount: number = 10,
    period: number = 1,
    homeScore: number = 0,
    awayScore: number = 0
  ) {
    return this.fetchApi('/events', {
      method: 'POST',
      body: JSON.stringify({
        action: 'simulate_events',
        gameId,
        homeTeamId,
        awayTeamId,
        eventCount,
        period,
        homeScore,
        awayScore,
      }),
    })
  }
}

export const apiService = new ApiService()
export default apiService
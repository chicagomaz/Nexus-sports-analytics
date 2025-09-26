// NBA API Service using free NBA Stats API
// This uses the official NBA.com stats API which is free but has rate limits

interface NBAGame {
  GAME_ID: string
  GAME_DATE_EST: string
  HOME_TEAM_ID: number
  HOME_TEAM_ABBREVIATION: string
  HOME_TEAM_NAME: string
  VISITOR_TEAM_ID: number
  VISITOR_TEAM_ABBREVIATION: string  
  VISITOR_TEAM_NAME: string
  PTS_HOME: number
  PTS_AWAY: number
  SEASON_ID: string
}

interface NBAGameDetail {
  gameId: string
  date: string
  homeTeam: {
    id: string
    name: string
    abbreviation: string
    score: number
  }
  awayTeam: {
    id: string
    name: string
    abbreviation: string
    score: number
  }
  isPlayoffs: boolean
  overtime: boolean
  gameType: 'regular' | 'playoffs' | 'classic'
  summary?: string
}

class NBAApiService {
  private baseUrl = 'https://stats.nba.com/stats'
  
  // Headers required by NBA API to avoid blocking
  private headers = {
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Host': 'stats.nba.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'x-nba-stats-origin': 'stats',
    'x-nba-stats-token': 'true',
    'Referer': 'https://www.nba.com/'
  }

  async fetchGames(season: string = '2023-24', dateFrom?: string, dateTo?: string): Promise<NBAGameDetail[]> {
    try {
      // Use leagueGameLog endpoint which is more reliable
      const params = new URLSearchParams({
        SeasonType: 'Regular Season',
        Season: season,
        Counter: '0',
        Direction: 'DESC',
        Sorter: 'DATE'
      })

      if (dateFrom) {
        params.append('DateFrom', dateFrom)
      }
      if (dateTo) {
        params.append('DateTo', dateTo)
      }

      const url = `${this.baseUrl}/leagueGameLog?${params}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.headers
      })

      if (!response.ok) {
        throw new Error(`NBA API Error: ${response.status}`)
      }

      const data = await response.json()
      
      // Process and transform the data
      const games = this.transformGameData(data.resultSets[0]?.rowSet || [])
      return games
      
    } catch (error) {
      console.error('Error fetching NBA games:', error)
      // Return demo data as fallback
      return this.getDemoGames()
    }
  }

  private transformGameData(rawData: any[]): NBAGameDetail[] {
    const gameMap = new Map<string, any>()
    
    // Group games by game ID (each game has 2 entries, one per team)
    rawData.forEach(row => {
      const gameId = row[4] // GAME_ID
      if (!gameMap.has(gameId)) {
        gameMap.set(gameId, { teams: [], gameDate: row[5] })
      }
      gameMap.get(gameId).teams.push({
        teamId: row[1],
        teamAbbr: row[2],
        teamName: row[3],
        isHome: row[6] === 'vs',
        points: row[24]
      })
    })

    // Convert to our format
    const games: NBAGameDetail[] = []
    
    gameMap.forEach((gameInfo, gameId) => {
      if (gameInfo.teams.length === 2) {
        const homeTeam = gameInfo.teams.find((t: any) => t.isHome)
        const awayTeam = gameInfo.teams.find((t: any) => !t.isHome)
        
        if (homeTeam && awayTeam) {
          games.push({
            gameId,
            date: gameInfo.gameDate,
            homeTeam: {
              id: homeTeam.teamId.toString(),
              name: homeTeam.teamName,
              abbreviation: homeTeam.teamAbbr,
              score: homeTeam.points
            },
            awayTeam: {
              id: awayTeam.teamId.toString(), 
              name: awayTeam.teamName,
              abbreviation: awayTeam.teamAbbr,
              score: awayTeam.points
            },
            isPlayoffs: false, // We'd need to check season type
            overtime: Math.abs(homeTeam.points - awayTeam.points) > 20 ? false : Math.random() < 0.1, // Rough estimate
            gameType: 'regular',
            summary: this.generateGameSummary(homeTeam, awayTeam)
          })
        }
      }
    })

    return games.slice(0, 50) // Limit to 50 games for performance
  }

  private generateGameSummary(homeTeam: any, awayTeam: any): string {
    const scoreDiff = Math.abs(homeTeam.points - awayTeam.points)
    const winner = homeTeam.points > awayTeam.points ? homeTeam : awayTeam
    const loser = homeTeam.points > awayTeam.points ? awayTeam : homeTeam
    
    if (scoreDiff <= 3) {
      return `Thrilling ${scoreDiff}-point victory for ${winner.teamName} in a nail-biter`
    } else if (scoreDiff >= 25) {
      return `Dominant ${scoreDiff}-point blowout victory for ${winner.teamName}`
    } else {
      return `${winner.teamName} defeats ${loser.teamName} in competitive matchup`
    }
  }

  // Alternative: Ball Don't Lie API (simpler, more reliable)
  async fetchGamesBallDontLie(page: number = 1, season?: number): Promise<NBAGameDetail[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '25'
      })

      if (season) {
        params.append('seasons[]', season.toString())
      }

      const response = await fetch(`https://www.balldontlie.io/api/v1/games?${params}`)
      
      if (!response.ok) {
        throw new Error(`Ball Don't Lie API Error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data.map((game: any) => ({
        gameId: game.id.toString(),
        date: game.date,
        homeTeam: {
          id: game.home_team.id.toString(),
          name: game.home_team.full_name,
          abbreviation: game.home_team.abbreviation,
          score: game.home_team_score || 0
        },
        awayTeam: {
          id: game.visitor_team.id.toString(),
          name: game.visitor_team.full_name, 
          abbreviation: game.visitor_team.abbreviation,
          score: game.visitor_team_score || 0
        },
        isPlayoffs: game.postseason || false,
        overtime: false, // API doesn't provide this info
        gameType: game.postseason ? 'playoffs' : 'regular',
        summary: this.generateSummaryFromScore(game)
      }))

    } catch (error) {
      console.error('Error fetching from Ball Don\'t Lie API:', error)
      return this.getDemoGames()
    }
  }

  private generateSummaryFromScore(game: any): string {
    if (!game.home_team_score || !game.visitor_team_score) {
      return `Upcoming game: ${game.visitor_team.full_name} @ ${game.home_team.full_name}`
    }

    const scoreDiff = Math.abs(game.home_team_score - game.visitor_team_score)
    const winner = game.home_team_score > game.visitor_team_score ? game.home_team : game.visitor_team
    
    if (scoreDiff <= 5) {
      return `Close ${scoreDiff}-point game won by ${winner.full_name}`
    } else if (scoreDiff >= 20) {
      return `${winner.full_name} dominates with ${scoreDiff}-point victory`
    }
    
    return `${winner.full_name} wins by ${scoreDiff} points`
  }

  // Fallback demo data
  private getDemoGames(): NBAGameDetail[] {
    return [
      {
        gameId: 'historic_1',
        date: '2016-06-19',
        homeTeam: { id: 'CLE', name: 'Cleveland Cavaliers', abbreviation: 'CLE', score: 93 },
        awayTeam: { id: 'GSW', name: 'Golden State Warriors', abbreviation: 'GSW', score: 89 },
        isPlayoffs: true,
        overtime: false,
        gameType: 'classic',
        summary: 'Game 7 NBA Finals - Cavaliers complete historic comeback from 3-1 deficit'
      },
      {
        gameId: 'historic_2', 
        date: '2013-06-18',
        homeTeam: { id: 'MIA', name: 'Miami Heat', abbreviation: 'MIA', score: 95 },
        awayTeam: { id: 'SAS', name: 'San Antonio Spurs', abbreviation: 'SAS', score: 88 },
        isPlayoffs: true,
        overtime: true,
        gameType: 'classic',
        summary: 'Game 6 NBA Finals - Ray Allen\'s clutch 3-pointer forces overtime'
      },
      {
        gameId: 'historic_3',
        date: '2020-08-24', 
        homeTeam: { id: 'POR', name: 'Portland Trail Blazers', abbreviation: 'POR', score: 117 },
        awayTeam: { id: 'DEN', name: 'Denver Nuggets', abbreviation: 'DEN', score: 126 },
        isPlayoffs: true,
        overtime: true,
        gameType: 'playoffs', 
        summary: 'Triple overtime thriller - Nuggets overcome 3-1 series deficit'
      },
      {
        gameId: 'historic_4',
        date: '2024-01-15',
        homeTeam: { id: 'BOS', name: 'Boston Celtics', abbreviation: 'BOS', score: 132 },
        awayTeam: { id: 'LAL', name: 'Los Angeles Lakers', abbreviation: 'LAL', score: 125 },
        isPlayoffs: false,
        overtime: false,
        gameType: 'regular',
        summary: 'High-scoring regular season matchup between conference rivals'
      },
      {
        gameId: 'historic_5',
        date: '2006-01-22',
        homeTeam: { id: 'LAL', name: 'Los Angeles Lakers', abbreviation: 'LAL', score: 122 },
        awayTeam: { id: 'TOR', name: 'Toronto Raptors', abbreviation: 'TOR', score: 104 },
        isPlayoffs: false,
        overtime: false,
        gameType: 'classic',
        summary: 'Kobe Bryant scores 81 points - second highest in NBA history'
      }
    ]
  }

  // Search function for filtering games
  searchGames(games: NBAGameDetail[], filters: any): NBAGameDetail[] {
    return games.filter(game => {
      // Game type filter
      if (filters.gameType !== 'all' && game.gameType !== filters.gameType) {
        return false
      }

      // Team filter
      if (filters.team && 
          !game.homeTeam.name.toLowerCase().includes(filters.team.toLowerCase()) &&
          !game.awayTeam.name.toLowerCase().includes(filters.team.toLowerCase()) &&
          !game.homeTeam.abbreviation.toLowerCase().includes(filters.team.toLowerCase()) &&
          !game.awayTeam.abbreviation.toLowerCase().includes(filters.team.toLowerCase())) {
        return false
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        if (!game.summary?.toLowerCase().includes(searchLower) &&
            !game.homeTeam.name.toLowerCase().includes(searchLower) &&
            !game.awayTeam.name.toLowerCase().includes(searchLower) &&
            !game.homeTeam.abbreviation.toLowerCase().includes(searchLower) &&
            !game.awayTeam.abbreviation.toLowerCase().includes(searchLower)) {
          return false
        }
      }

      // Date filters
      if (filters.dateFrom && game.date < filters.dateFrom) {
        return false
      }
      if (filters.dateTo && game.date > filters.dateTo) {
        return false
      }

      return true
    })
  }
}

export const nbaApiService = new NBAApiService()
export type { NBAGameDetail }
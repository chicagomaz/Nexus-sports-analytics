// Player and Team Types
export interface Player {
  id: string;
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  teamId: string;
  jerseyNumber: number;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
}

// Game Event Types
export type GameEventType = 
  | 'SHOT_MADE' 
  | 'SHOT_MISSED' 
  | 'FREE_THROW_MADE' 
  | 'FREE_THROW_MISSED'
  | 'REBOUND_OFFENSIVE' 
  | 'REBOUND_DEFENSIVE'
  | 'ASSIST' 
  | 'STEAL' 
  | 'BLOCK' 
  | 'TURNOVER'
  | 'FOUL_PERSONAL' 
  | 'FOUL_TECHNICAL'
  | 'SUBSTITUTION'
  | 'TIMEOUT'
  | 'PERIOD_START'
  | 'PERIOD_END';

export interface GameEvent {
  id: string;
  gameId: string;
  timestamp: string; // ISO string
  gameClockSeconds: number; // seconds remaining in period
  period: number; // 1-4 for regulation, 5+ for overtime
  eventType: GameEventType;
  playerId?: string;
  teamId: string;
  opponentTeamId: string;
  
  // Shot-specific data
  shotType?: '2PT' | '3PT';
  shotZone?: 'PAINT' | 'MID_RANGE' | 'THREE_POINT' | 'FREE_THROW';
  shotDistance?: number; // feet from basket
  
  // Additional context
  assistPlayerId?: string;
  reboundType?: 'OFFENSIVE' | 'DEFENSIVE';
  foulType?: 'SHOOTING' | 'PERSONAL' | 'TECHNICAL' | 'FLAGRANT';
  
  // Score after event
  homeScore: number;
  awayScore: number;
}

// Real-time Analytics Types
export interface GameStats {
  gameId: string;
  teamId: string;
  opponentTeamId: string;
  period: number;
  
  // Basic stats
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  rebounds: number;
  offensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  
  // Advanced metrics
  pace: number; // possessions per game
  offensiveRating: number; // points per 100 possessions
  defensiveRating: number; // opponent points per 100 possessions
  effectiveFieldGoalPercentage: number; // (FGM + 0.5 * 3PM) / FGA
  turnoverRate: number; // TO / (FGA + 0.44 * FTA + TO)
  reboundRate: number; // team rebounds / total rebounds available
  
  lastUpdated: string;
}

export interface PlayerStats {
  gameId: string;
  playerId: string;
  teamId: string;
  
  minutesPlayed: number;
  points: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  rebounds: number;
  offensiveRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  
  // Advanced metrics
  playerImpactEstimate: number; // +/- while on court
  usageRate: number; // percentage of team possessions used
  trueShootingPercentage: number; // points / (2 * (FGA + 0.44 * FTA))
  
  lastUpdated: string;
}

// ML Prediction Types
export interface WinProbabilityPrediction {
  gameId: string;
  timestamp: string;
  homeTeamId: string;
  awayTeamId: string;
  homeWinProbability: number; // 0.0 to 1.0
  awayWinProbability: number; // 0.0 to 1.0
  confidence: number; // model confidence score
  
  // Input features used for prediction
  scoreDifferential: number;
  timeRemaining: number; // total seconds left in game
  homeTeamOffensiveRating: number;
  homeTeamDefensiveRating: number;
  awayTeamOffensiveRating: number;
  awayTeamDefensiveRating: number;
  momentumIndicator: number; // recent scoring trend
}

// API Response Types
export interface GameSummary {
  gameId: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  period: number;
  gameClockSeconds: number;
  gameStatus: 'SCHEDULED' | 'LIVE' | 'HALFTIME' | 'FINAL';
  startTime: string;
  
  homeStats: GameStats;
  awayStats: GameStats;
  winProbability?: WinProbabilityPrediction;
}

export interface LiveDashboardData {
  game: GameSummary;
  recentEvents: GameEvent[];
  topPerformers: {
    home: PlayerStats[];
    away: PlayerStats[];
  };
  keyMetrics: {
    pace: number;
    leadChanges: number;
    biggestLead: number;
    timeOfBiggestLead: string;
  };
}

// Historical Game Types
export interface HistoricalGame {
  id: string;
  date: string;
  season: number; // e.g., 2024 for 2024-25 season
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  gameStatus: 'FINAL' | 'POSTPONED' | 'CANCELLED';
  playoffs?: boolean;
  playoffRound?: 'FIRST_ROUND' | 'CONFERENCE_SEMIS' | 'CONFERENCE_FINALS' | 'NBA_FINALS';
  overtimePeriods?: number;
}

export interface HistoricalGameStats extends GameStats {
  // Additional historical context
  venue?: string;
  attendance?: number;
  duration?: string; // game duration like "2:18"
}

export interface HistoricalPlayerPerformance extends PlayerStats {
  // Career context at time of game
  seasonAvg?: {
    points: number;
    rebounds: number;
    assists: number;
  };
  isSeasonHigh?: boolean;
  isCareerHigh?: boolean;
}

export interface GameSearchFilters {
  dateFrom?: string;
  dateTo?: string;
  seasons?: number[];
  teams?: string[];
  playoffs?: boolean;
  minScore?: number;
  maxScore?: number;
  overtimeOnly?: boolean;
  venue?: string;
}

export interface GameSearchResult {
  games: HistoricalGame[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface HistoricalGameDetail extends HistoricalGame {
  homeStats: HistoricalGameStats;
  awayStats: HistoricalGameStats;
  topPerformers: {
    home: HistoricalPlayerPerformance[];
    away: HistoricalPlayerPerformance[];
  };
  gameEvents?: GameEvent[];
  keyMoments?: {
    leadChanges: number;
    biggestLead: { team: string; points: number; time: string };
    clutchShots?: { playerId: string; time: string; description: string }[];
  };
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'GAME_EVENT' | 'STATS_UPDATE' | 'WIN_PROBABILITY_UPDATE' | 'GAME_STATUS_UPDATE';
  gameId: string;
  timestamp: string;
  data: GameEvent | GameStats | WinProbabilityPrediction | GameSummary;
}
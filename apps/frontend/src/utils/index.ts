import { GameEvent, GameStats, PlayerStats, GameEventType } from '@/types';

// Utility functions
export function formatGameClock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function calculateMomentum(recentEvents: GameEvent[], teamId: string): number {
  // Calculate momentum based on recent 5 minutes of events
  const recentPoints = recentEvents
    .filter(e => e.teamId === teamId && 
      (e.eventType === 'SHOT_MADE' || e.eventType === 'FREE_THROW_MADE'))
    .reduce((sum, e) => {
      if (e.eventType === 'FREE_THROW_MADE') return sum + 1;
      if (e.shotType === '3PT') return sum + 3;
      return sum + 2;
    }, 0);
    
  const opponentPoints = recentEvents
    .filter(e => e.teamId !== teamId && 
      (e.eventType === 'SHOT_MADE' || e.eventType === 'FREE_THROW_MADE'))
    .reduce((sum, e) => {
      if (e.eventType === 'FREE_THROW_MADE') return sum + 1;
      if (e.shotType === '3PT') return sum + 3;
      return sum + 2;
    }, 0);
    
  return recentPoints - opponentPoints; // Positive = momentum in favor
}

// Basketball Analytics Calculations
export class BasketballAnalytics {
  
  static calculatePace(possessions: number, minutes: number): number {
    return (possessions / minutes) * 48; // normalized to 48 minutes
  }
  
  static calculateOffensiveRating(points: number, possessions: number): number {
    return possessions > 0 ? (points / possessions) * 100 : 0;
  }
  
  static calculateDefensiveRating(opponentPoints: number, possessions: number): number {
    return possessions > 0 ? (opponentPoints / possessions) * 100 : 0;
  }
  
  static calculateEffectiveFieldGoalPercentage(
    fgm: number, 
    fga: number, 
    threepm: number
  ): number {
    if (fga === 0) return 0;
    return ((fgm + 0.5 * threepm) / fga) * 100;
  }
  
  static calculateTurnoverRate(
    turnovers: number, 
    fga: number, 
    fta: number
  ): number {
    const denominator = fga + 0.44 * fta + turnovers;
    return denominator > 0 ? (turnovers / denominator) * 100 : 0;
  }
  
  static calculateTrueShootingPercentage(
    points: number, 
    fga: number, 
    fta: number
  ): number {
    const denominator = 2 * (fga + 0.44 * fta);
    return denominator > 0 ? (points / denominator) * 100 : 0;
  }
}
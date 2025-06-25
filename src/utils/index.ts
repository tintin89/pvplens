import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format large numbers with abbreviations (K, M, B)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Calculate win rate percentage
 */
export function calculateWinRate(won: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((won / total) * 100);
}

/**
 * Format rating with appropriate color class
 */
export function getRatingColor(rating: number): string {
  if (rating >= 2400) return 'text-purple-400'; // Gladiator/Elite
  if (rating >= 2100) return 'text-blue-400';   // Duelist
  if (rating >= 1800) return 'text-green-400';  // Rival
  if (rating >= 1400) return 'text-yellow-400'; // Challenger
  if (rating >= 1000) return 'text-gray-400';   // Combatant
  return 'text-gray-500'; // Unranked
}

/**
 * Get rating tier name based on WoW PvP rating system
 * Note: Gladiator also requires 50+ wins at 2400+ rating, but we only show based on rating here
 */
export function getRatingTier(rating: number): string {
  if (rating >= 2400) return 'Elite';      // 2400+ (Gladiator needs 50 wins too)
  if (rating >= 2100) return 'Duelist';    // 2100-2399  
  if (rating >= 1800) return 'Rival';      // 1800-2099
  if (rating >= 1400) return 'Challenger'; // 1400-1799
  if (rating >= 1000) return 'Combatant';  // 1000-1399
  return 'Unranked';                       // 0-999
}

/**
 * Get rating tier name including Gladiator status based on wins
 * This function can be used when win count is available
 */
export function getRatingTierWithWins(rating: number, wins: number = 0): string {
  if (rating >= 2400 && wins >= 50) return 'Gladiator'; // 2400+ rating AND 50+ wins
  if (rating >= 2400) return 'Elite';      // 2400+ rating but less than 50 wins
  if (rating >= 2100) return 'Duelist';    // 2100-2399  
  if (rating >= 1800) return 'Rival';      // 1800-2099
  if (rating >= 1400) return 'Challenger'; // 1400-1799
  if (rating >= 1000) return 'Combatant';  // 1000-1399
  return 'Unranked';                       // 0-999
}

/**
 * Format timestamp to readable date
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format timestamp to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const date = new Date(timestamp * 1000);
  const diff = now - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const weeks = Math.floor(diff / 604800000);
  const months = Math.floor(diff / 2629746000);
  const years = Math.floor(diff / 31556952000);

  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Convert realm name to slug format
 */
export function realmNameToSlug(realmName: string): string {
  return realmName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get character class color
 */
export function getClassColor(className: string): string {
  const classColors: Record<string, string> = {
    'Death Knight': '#C41E3A',
    'Demon Hunter': '#A330C9',
    'Druid': '#FF7C0A',
    'Evoker': '#33937F',
    'Hunter': '#AAD372',
    'Mage': '#3FC7EB',
    'Monk': '#00FF98',
    'Paladin': '#F48CBA',
    'Priest': '#FFFFFF',
    'Rogue': '#FFF468',
    'Shaman': '#0070DD',
    'Warlock': '#8788EE',
    'Warrior': '#C69B6D'
  };
  
  return classColors[className] || '#FFFFFF';
}

/**
 * Get faction color
 */
export function getFactionColor(faction: string): string {
  return faction.toLowerCase() === 'alliance' ? '#0078FF' : '#DC143C';
}

/**
 * Capitalize first letter of each word
 */
export function capitalize(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Debounce function for search inputs with cancel capability
 */
export function debounce<T extends (...args: string[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Check if a string is empty or whitespace
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Validate character name format
 */
export function isValidCharacterName(name: string): boolean {
  // WoW character names: 2-12 characters, letters only, first letter capitalized
  const regex = /^[A-Z][a-z]{1,11}$/;
  return regex.test(name);
}

/**
 * Format PvP bracket display name
 */
export function formatBracketName(bracketSlug: string): string {
  const bracketNames: Record<string, string> = {
    '2v2': '2v2 Arena',
    '3v3': '3v3 Arena',
    'rbg': 'Rated Battlegrounds',
    'shuffle': 'Solo Shuffle'
  };
  
  return bracketNames[bracketSlug] || capitalize(bracketSlug);
}

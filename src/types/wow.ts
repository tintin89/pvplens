// World of Warcraft API Types

export interface BlizzardApiResponse<T> {
  data: T;
  links?: {
    self: {
      href: string;
    };
  };
}

export interface Character {
  id: number;
  name: string;
  realm: Realm;
  character_class: CharacterClass;
  race: Race;
  gender: Gender;
  faction: Faction;
  level: number;
  achievement_points: number;
  last_login_timestamp?: number;
  average_item_level?: number;
  equipped_item_level?: number;
  active_spec?: Specialization;
  guild?: Guild;
  covenant_progress?: CovenantProgress;
}

export interface Realm {
  id: number;
  name: string;
  slug: string;
  category: string;
  locale: string;
  timezone: string;
  type: {
    type: string;
    name: string;
  };
  is_tournament: boolean;
  region: {
    id: number;
    name: string;
  };
}

export interface CharacterClass {
  id: number;
  name: string;
  power_type: {
    id: number;
    name: string;
  };
  specializations: Specialization[];
}

export interface Specialization {
  id: number;
  name: string;
  description?: string;
  role: {
    type: string;
    name: string;
  };
  is_class_default?: boolean;
  is_pet_specialization?: boolean;
}

export interface Race {
  id: number;
  name: string;
  faction: {
    type: string;
    name: string;
  };
}

export interface Gender {
  type: string;
  name: string;
}

export interface Faction {
  type: string;
  name: string;
}

export interface Guild {
  id: number;
  name: string;
  realm: Realm;
  faction: Faction;
  member_count?: number;
  achievement_points?: number;
}

export interface CovenantProgress {
  chosen_covenant?: {
    id: number;
    name: string;
  };
  renown_level?: number;
  soulbinds?: any[];
}

// PVP Specific Types
export interface PvpSeason {
  id: number;
  start_timestamp: number;
  end_timestamp: number;
}

export interface PvpBracket {
  id: number;
  type: string;
  slug: string;
}

export interface PvpSeasonStats {
  season: PvpSeason;
  rating: number;
  games_played: number;
  games_won: number;
  games_lost: number;
  tier?: PvpTier;
}

export interface PvpTier {
  id: number;
  name: string;
  min_rating: number;
  max_rating: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

export interface CharacterPvpSummary {
  honor_level: number;
  pvp_map_statistics: PvpMapStatistic[];
  honorable_kills: number;
  brackets: {
    [key: string]: PvpBracketStats;
  };
}

export interface PvpBracketStats {
  href: string;
  bracket: PvpBracket;
  rating: number;
  season_match_statistics: PvpMatchStatistics;
  tier: PvpTier;
}

export interface PvpMatchStatistics {
  played: number;
  won: number;
  lost: number;
}

export interface PvpMapStatistic {
  world_map: {
    id: number;
    name: string;
  };
  match_statistics: PvpMatchStatistics;
}

// API Error Types
export interface ApiError {
  code: number;
  type: string;
  detail: string;
}

// Search and Filter Types
export interface SearchFilters {
  region?: string;
  realm?: string;
  characterClass?: number;
  race?: number;
  faction?: string;
  minRating?: number;
  maxRating?: number;
  bracket?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface CharacterSearchState extends LoadingState {
  characters: Character[];
  totalCount: number;
  currentPage: number;
}

export interface PvpStatsState extends LoadingState {
  stats?: CharacterPvpSummary;
  seasonHistory: PvpSeasonStats[];
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CharacterService } from '@/services/character.service';
import { SearchFilters } from '@/types/wow';

const characterService = new CharacterService();

/**
 * Hook to fetch character profile data
 */
export function useCharacterProfile(
  realmSlug: string, 
  characterName: string, 
  region: string = 'us',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['character', 'profile', region, realmSlug, characterName],
    queryFn: () => characterService.getCharacterProfile(realmSlug, characterName, region),
    enabled: enabled && !!realmSlug && !!characterName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch character PvP summary
 */
export function useCharacterPvpSummary(
  realmSlug: string, 
  characterName: string, 
  region: string = 'us',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['character', 'pvp', region, realmSlug, characterName],
    queryFn: () => characterService.getCharacterPvpSummary(realmSlug, characterName, region),
    enabled: enabled && !!realmSlug && !!characterName,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch character media (avatars, renders)
 */
export function useCharacterMedia(
  realmSlug: string, 
  characterName: string, 
  region: string = 'us',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['character', 'media', region, realmSlug, characterName],
    queryFn: () => characterService.getCharacterMedia(realmSlug, characterName, region),
    enabled: enabled && !!realmSlug && !!characterName,
    staleTime: 30 * 60 * 1000, // 30 minutes (media doesn't change often)
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
}

/**
 * Hook to fetch full character data (profile + pvp + media + equipment)
 */
export function useFullCharacterData(
  realmSlug: string, 
  characterName: string, 
  region: string = 'us',
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['character', 'full', region, realmSlug, characterName],
    queryFn: () => characterService.getFullCharacterData(realmSlug, characterName, region),
    enabled: enabled && !!realmSlug && !!characterName,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

/**
 * Hook to search for characters
 */
export function useCharacterSearch(
  characterName: string,
  region: string = 'us',
  filters?: SearchFilters,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['character', 'search', region, characterName, filters],
    queryFn: () => characterService.searchCharacters(characterName, region, filters),
    enabled: enabled && !!characterName && characterName.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
  });
}

/**
 * Hook to fetch PvP leaderboards
 */
export function usePvpLeaderboard(
  bracket: string,
  region: string = 'us',
  season?: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['pvp', 'leaderboard', region, bracket, season],
    queryFn: () => characterService.getPvpLeaderboard(bracket, region, season),
    enabled: enabled && !!bracket,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch current PvP season
 */
export function useCurrentPvpSeason(region: string = 'us', enabled: boolean = true) {
  return useQuery({
    queryKey: ['pvp', 'season', 'current', region],
    queryFn: () => characterService.getCurrentPvpSeason(region),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
}

/**
 * Hook to validate character existence
 */
export function useCharacterValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ realmSlug, characterName, region }: {
      realmSlug: string;
      characterName: string;
      region: string;
    }) => characterService.validateCharacter(realmSlug, characterName, region),
    onSuccess: (isValid, { realmSlug, characterName, region }) => {
      if (isValid) {
        // Prefetch character data if validation succeeds
        queryClient.prefetchQuery({
          queryKey: ['character', 'profile', region, realmSlug, characterName],
          queryFn: () => characterService.getCharacterProfile(realmSlug, characterName, region),
          staleTime: 5 * 60 * 1000,
        });
      }
    },
  });
}

/**
 * Hook to prefetch character data
 */
export function usePrefetchCharacter() {
  const queryClient = useQueryClient();

  return {
    prefetchProfile: (realmSlug: string, characterName: string, region: string = 'us') => {
      queryClient.prefetchQuery({
        queryKey: ['character', 'profile', region, realmSlug, characterName],
        queryFn: () => characterService.getCharacterProfile(realmSlug, characterName, region),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchPvpSummary: (realmSlug: string, characterName: string, region: string = 'us') => {
      queryClient.prefetchQuery({
        queryKey: ['character', 'pvp', region, realmSlug, characterName],
        queryFn: () => characterService.getCharacterPvpSummary(realmSlug, characterName, region),
        staleTime: 2 * 60 * 1000,
      });
    },
  };
}

import { BlizzardApiService } from './blizzard-api.service';
import { mockCharacterData } from './mock-data';
import { 
  Character, 
  CharacterPvpSummary, 
  SearchFilters
} from '@/types/wow';

export class CharacterService extends BlizzardApiService {
  
  private useMockData(): boolean {
    return !process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID || 
           !process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_SECRET;
  }

  /**
   * Get character profile information
   */
  async getCharacterProfile(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<Character> {
    if (this.useMockData()) {
      // Return mock data for development
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return mockCharacterData.profile as Character;
    }

    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`;
    return this.get<Character>(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character PvP summary
   */
  async getCharacterPvpSummary(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<CharacterPvpSummary> {
    if (this.useMockData()) {
      // Return mock data for development
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return mockCharacterData.pvp as CharacterPvpSummary;
    }

    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-summary`;
    return this.get<CharacterPvpSummary>(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character media (avatars, renders)
   */
  async getCharacterMedia(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<any> {
    if (this.useMockData()) {
      // Return mock data for development
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
      return mockCharacterData.media;
    }

    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`;
    return this.get<any>(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }
  /**
   * Get full character data (profile + pvp + media)
   */
  async getFullCharacterData(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ) {
    try {
      const [profile, pvp, media] = await Promise.all([
        this.getCharacterProfile(realmSlug, characterName, region),
        this.getCharacterPvpSummary(realmSlug, characterName, region),
        this.getCharacterMedia(realmSlug, characterName, region)
      ]);

      return {
        profile,
        pvp,
        media,
        error: null
      };
    } catch (error) {
      console.error('Error fetching character data:', error);
      return {
        profile: null,
        pvp: null,
        media: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Search for characters (mock implementation for now)
   */
  async searchCharacters(
    characterName: string,
    region: string = 'us',
    filters?: SearchFilters
  ) {
    // Mock implementation - in production this would use the Blizzard API search
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      results: [
        {
          name: characterName,
          realm: 'stormrage',
          level: 80,
          class: 'Warrior',
          race: 'Human',
          faction: 'Alliance'
        }
      ],
      total: 1,
      hasMore: false
    };
  }

  /**
   * Get PvP leaderboard (mock implementation for now)
   */
  async getPvpLeaderboard(
    bracket: string,
    region: string = 'us',
    season?: number
  ) {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      leaderboard: [
        {
          rank: 1,
          rating: 3127,
          character: {
            name: 'TopPlayer',
            realm: 'mal-ganis',
            class: 'Death Knight'
          }
        }
      ]
    };
  }

  /**
   * Get current PvP season (mock implementation for now)
   */
  async getCurrentPvpSeason(region: string = 'us') {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id: 37,
      season_start_timestamp: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 30 days ago
      season_end_timestamp: Math.floor(Date.now() / 1000) + (60 * 24 * 60 * 60), // 60 days from now
    };
  }

  /**
   * Validate character existence (mock implementation for now)
   */
  async validateCharacter(
    realmSlug: string,
    characterName: string,
    region: string = 'us'
  ): Promise<boolean> {
    try {
      await this.getCharacterProfile(realmSlug, characterName, region);
      return true;
    } catch (error) {
      return false;
    }
  }
}

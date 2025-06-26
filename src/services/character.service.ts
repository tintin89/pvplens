import { BlizzardApiService } from './blizzard-api.service';
import { mockCharacterData } from './mock-data';
import { 
  Character, 
  CharacterPvpSummary, 
  CharacterMedia,
  SearchFilters
} from '@/types/wow';

export class CharacterService extends BlizzardApiService {
  
  private useMockData(): boolean {
    // Check if API configuration is available
    const hasClientId = process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID && 
                       process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID.trim() !== '' &&
                       !process.env.NEXT_PUBLIC_BLIZZARD_CLIENT_ID.includes('your_client_id');
    
    const hasApiBaseUrl = process.env.NEXT_PUBLIC_BLIZZARD_API_BASE_URL && 
                         process.env.NEXT_PUBLIC_BLIZZARD_API_BASE_URL.trim() !== '';
    
    const hasOAuthUrl = process.env.NEXT_PUBLIC_BLIZZARD_OAUTH_URL && 
                       process.env.NEXT_PUBLIC_BLIZZARD_OAUTH_URL.trim() !== '';
    
    // If basic config is missing, use mock data
    return !hasClientId || !hasApiBaseUrl || !hasOAuthUrl;
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
      console.log('🔧 Using mock data - API credentials not configured');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return mockCharacterData.profile as Character;
    }

    try {
      console.log(`🌐 Fetching character profile: ${characterName}@${realmSlug} (${region})`);
      const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}`;
      const response = await this.get<Character>(endpoint, {
        namespace: `profile-${region}`,
        locale: 'en_US'
      });
      console.log('✅ Character profile fetched successfully');
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch character profile:', error);
      throw error;
    }
  }

  /**
   * Get character PvP summary with detailed bracket data
   */
  async getCharacterPvpSummary(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<CharacterPvpSummary> {
    if (this.useMockData()) {
      console.log('🔧 Using mock PvP data - API credentials not configured');
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      return mockCharacterData.pvp as CharacterPvpSummary;
    }

    try {
      console.log(`🛡️ Fetching PvP summary: ${characterName}@${realmSlug} (${region})`);
      const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-summary`;
      const response = await this.get<Record<string, unknown>>(endpoint, {
        namespace: `profile-${region}`,
        locale: 'en_US'
      });
      
      console.log('✅ PvP summary fetched successfully');

      // Transform the API response to match our expected structure
      const transformedResponse = await this.transformPvpSummary(response);
      
      return transformedResponse;
    } catch (error) {
      console.error('❌ Failed to fetch PvP summary:', error);
      throw error;
    }
  }

  /**
   * Transform raw PvP summary to expected format by fetching individual bracket data
   */
  private async transformPvpSummary(rawSummary: Record<string, unknown>): Promise<CharacterPvpSummary> {
    const brackets: Record<string, unknown> = {};
    
    if (rawSummary.brackets && Array.isArray(rawSummary.brackets)) {
      console.log(`🔗 Fetching ${rawSummary.brackets.length} bracket details...`);
      
      // Fetch each bracket's detailed data
      for (const bracketLink of rawSummary.brackets) {
        try {
          // Extract bracket type from URL (e.g., "2v2", "3v3", "shuffle-mage-frost")
          const urlParts = bracketLink.href.split('/');
          const bracketType = urlParts[urlParts.length - 1].split('?')[0];
          
          // Fetch the bracket data directly using the full URL
          const bracketData = await this.fetchBracketData(bracketLink.href);
          
          if (bracketData) {
            brackets[bracketType] = {
              rating: (bracketData.rating as number) || 0,
              bracket: {
                slug: bracketType
              },
              season_match_statistics: (bracketData.season_match_statistics as {
                won: number;
                lost: number;
                played: number;
              }) || {
                won: 0,
                lost: 0,
                played: 0
              }
            };
          }
        } catch (error) {
          console.warn(`⚠️ Failed to fetch bracket data for ${bracketLink.href}:`, error);
          // Continue with other brackets even if one fails
        }
      }
    }

    return {
      brackets,
      honor_level: (rawSummary.honor_level as number) || 0,
      honorable_kills: (rawSummary.honorable_kills as number) || 0,
      pvp_map_statistics: (rawSummary.pvp_map_statistics as unknown[]) || [],
      character: rawSummary.character
    } as CharacterPvpSummary;
  }

  /**
   * Fetch individual bracket data from Blizzard API
   */
  private async fetchBracketData(bracketUrl: string): Promise<Record<string, unknown> | null> {
    try {
      // Extract the endpoint path from the full URL
      const url = new URL(bracketUrl);
      const endpoint = url.pathname + url.search;
      
      const response = await this.get<Record<string, unknown>>(endpoint);
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch bracket data from ${bracketUrl}:`, error);
      return null;
    }
  }

  /**
   * Get character media (avatars, renders)
   */
  async getCharacterMedia(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<CharacterMedia> {
    if (this.useMockData()) {
      // Return mock data for development
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
      // Mock character media data structure
      return {
        character: mockCharacterData.profile,
        assets: mockCharacterData.media.assets
      } as CharacterMedia;
    }

    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`;
    return this.get<CharacterMedia>(endpoint, {
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
    _region: string = 'us', // eslint-disable-line @typescript-eslint/no-unused-vars
    _filters?: SearchFilters // eslint-disable-line @typescript-eslint/no-unused-vars
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
    _region: string = 'us', // eslint-disable-line @typescript-eslint/no-unused-vars
    _season?: number // eslint-disable-line @typescript-eslint/no-unused-vars
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
  async getCurrentPvpSeason(_region: string = 'us') { // eslint-disable-line @typescript-eslint/no-unused-vars
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
    } catch (_error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      return false;
    }
  }
}

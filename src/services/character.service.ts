import { BlizzardApiService } from './blizzard-api.service';
import { 
  Character, 
  CharacterPvpSummary, 
  PvpSeasonStats, 
  BlizzardApiResponse,
  SearchFilters,
  Realm
} from '@/types/wow';

export class CharacterService extends BlizzardApiService {
  
  /**
   * Get character profile information
   */
  async getCharacterProfile(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<Character> {
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
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-summary`;
    return this.get<CharacterPvpSummary>(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character PvP bracket statistics
   */
  async getCharacterPvpBracket(
    realmSlug: string, 
    characterName: string, 
    pvpBracket: string,
    region: string = 'us'
  ): Promise<any> {
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/pvp-bracket/${pvpBracket}`;
    return this.get(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character achievements
   */
  async getCharacterAchievements(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<any> {
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/achievements`;
    return this.get(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character statistics
   */
  async getCharacterStatistics(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<any> {
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/statistics`;
    return this.get(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character equipment
   */
  async getCharacterEquipment(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<any> {
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/equipment`;
    return this.get(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get character media (avatar, main render, etc.)
   */
  async getCharacterMedia(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<any> {
    const endpoint = `/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/character-media`;
    return this.get(endpoint, {
      namespace: `profile-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Search for characters by name across realms
   */
  async searchCharacters(
    characterName: string,
    region: string = 'us',
    filters?: SearchFilters
  ): Promise<any> {
    const params: any = {
      namespace: `profile-${region}`,
      locale: 'en_US',
      'name.en_US': characterName
    };

    // Add filters if provided
    if (filters?.realm) {
      params['realm'] = filters.realm;
    }
    if (filters?.characterClass) {
      params['character_class'] = filters.characterClass;
    }
    if (filters?.race) {
      params['race'] = filters.race;
    }

    return this.get('/data/wow/search/character', params);
  }

  /**
   * Get PvP leaderboards for a bracket
   */
  async getPvpLeaderboard(
    bracket: string,
    region: string = 'us',
    season?: number
  ): Promise<any> {
    let endpoint = `/data/wow/pvp-season`;
    
    if (season) {
      endpoint += `/${season}`;
    }
    
    endpoint += `/pvp-leaderboard/${bracket}`;

    return this.get(endpoint, {
      namespace: `dynamic-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get current PvP season information
   */
  async getCurrentPvpSeason(region: string = 'us'): Promise<any> {
    return this.get('/data/wow/pvp-season/index', {
      namespace: `dynamic-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Get PvP rewards for a season
   */
  async getPvpSeasonRewards(
    seasonId: number,
    region: string = 'us'
  ): Promise<any> {
    return this.get(`/data/wow/pvp-season/${seasonId}/pvp-reward/index`, {
      namespace: `dynamic-${region}`,
      locale: 'en_US'
    });
  }

  /**
   * Validate if a character exists
   */
  async validateCharacter(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<boolean> {
    try {
      await this.getCharacterProfile(realmSlug, characterName, region);
      return true;
    } catch (error: any) {
      if (error.code === 404) {
        return false;
      }
      throw error;
    }
  }

  /**
   * Get detailed character information including PvP stats
   */
  async getFullCharacterData(
    realmSlug: string, 
    characterName: string, 
    region: string = 'us'
  ): Promise<{
    profile: Character;
    pvpSummary: CharacterPvpSummary;
    media: any;
    equipment: any;
  }> {
    try {
      const [profile, pvpSummary, media, equipment] = await Promise.all([
        this.getCharacterProfile(realmSlug, characterName, region),
        this.getCharacterPvpSummary(realmSlug, characterName, region),
        this.getCharacterMedia(realmSlug, characterName, region),
        this.getCharacterEquipment(realmSlug, characterName, region)
      ]);

      return {
        profile,
        pvpSummary,
        media,
        equipment
      };
    } catch (error) {
      throw error;
    }
  }
}

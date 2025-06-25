'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingState, LoadingSkeleton } from '@/components/ui/loading';
import { useFullCharacterData } from '@/hooks/useCharacter';
import { 
  calculateWinRate, 
  getRatingColor, 
  getRatingTierWithWins,
  getClassColor,
  formatRelativeTime,
  formatBracketName
} from '@/utils';

interface CharacterProfileProps {
  characterName: string;
  realmSlug: string;
  region: string;
}

interface BracketData {
  rating: number;
  bracket?: {
    slug: string;
  };
  bracket_id?: string;
  season_match_statistics?: {
    won: number;
    lost: number;
    played: number;
  };
}

export function CharacterProfile({ characterName, realmSlug, region }: CharacterProfileProps) {
  const { data, isLoading, error } = useFullCharacterData(realmSlug, characterName, region);

  return (
    <LoadingState 
      isLoading={isLoading} 
      error={error?.message}
      loadingComponent={<CharacterProfileSkeleton />}
    >
      {data && data.profile && (
        <div className="space-y-6">
          {/* Character Header */}
          <Card className="relative overflow-hidden bg-transparent backdrop-blur-md border border-white/20">
            {/* Faction Emblem Background */}
            <div 
              className="absolute right-0 top-0 w-64 h-64 opacity-10 bg-contain bg-no-repeat bg-right-top z-5"
              style={{ 
                backgroundImage: `url(${data.profile.faction.type === 'ALLIANCE' 
                  ? 'https://wow.zamimg.com/images/wow/icons/large/achievement_pvp_a_16.jpg'
                  : 'https://wow.zamimg.com/images/wow/icons/large/achievement_pvp_h_16.jpg'
                })` 
              }}
            />
            <CardContent className="relative z-20 p-8">
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-bold text-wow-gold">
                        {data.profile.name}
                      </h1>
                      <Badge 
                        variant={data.profile.faction.type === 'ALLIANCE' ? 'alliance' : 'horde'}
                        className="text-sm"
                      >
                        {data.profile.faction.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-wow-gold/80">
                      <span className="text-lg">
                        Level {data.profile.level} 
                        <span 
                          className="ml-2 font-medium"
                          style={{ color: getClassColor(data.profile.character_class.name) }}
                        >
                          {data.profile.character_class.name}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{data.profile.race.name}</span>
                      <span>•</span>
                      <span>{data.profile.realm.name}</span>
                    </div>
                    {data.profile.guild && (
                      <div className="text-wow-gold/70">
                        &lt;{data.profile.guild.name}&gt;
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {data.profile.last_login_timestamp && (
                      <div className="text-wow-gold/60 text-sm">
                        Last seen: {formatRelativeTime(data.profile.last_login_timestamp)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Character Avatar */}
                {data.media?.assets?.[1]?.value && (
                  <div className="flex-shrink-0">
                    <img 
                      src={data.media.assets[1].value} 
                      alt={`${data.profile.name} avatar`}
                      className="w-32 h-32 rounded-lg border-2 border-white/20"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PvP Brackets */}
          {data.pvp?.brackets && Object.keys(data.pvp.brackets).length > 0 && (
            <Card className="relative overflow-hidden">
              {/* CSS Faction Emblem Background for Stats Cards */}
              <div className={`faction-emblem-background ${data.profile.faction.type === 'ALLIANCE' ? 'alliance-emblem' : 'horde-emblem'}`} />
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  PvP Ratings
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(data.pvp.brackets || {}).map(([bracketType, bracketData]: [string, BracketData]) => {
                    // Safe access to bracket slug with fallbacks
                    const bracketSlug = bracketData?.bracket?.slug || bracketData?.bracket_id || bracketType;
                    
                    return (
                      <div key={bracketType} className="wow-card bg-transparent border border-white/20 backdrop-blur-sm p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-wow-gold">
                            {formatBracketName(bracketSlug)}
                          </h4>
                          <Badge 
                            variant={getRatingTierWithWins(bracketData.rating, bracketData.season_match_statistics?.won || 0).toLowerCase() as 'gladiator' | 'elite' | 'duelist' | 'rival' | 'challenger' | 'combatant' | 'unranked'}
                            className="text-xs"
                          >
                            {getRatingTierWithWins(bracketData.rating, bracketData.season_match_statistics?.won || 0)}
                          </Badge>
                        </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-wow-gold/70">Rating:</span>
                          <span 
                            className={`font-bold ${getRatingColor(bracketData.rating)}`}
                          >
                            {bracketData.rating}
                          </span>
                        </div>
                        
                        {bracketData.season_match_statistics && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-wow-gold/70">Wins:</span>
                              <span className="text-green-400 font-medium">
                                {bracketData.season_match_statistics.won}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-wow-gold/70">Losses:</span>
                              <span className="text-red-400 font-medium">
                                {bracketData.season_match_statistics.lost}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-wow-gold/70">Win Rate:</span>
                              <span className={`font-medium ${
                                calculateWinRate(
                                  bracketData.season_match_statistics.won,
                                  bracketData.season_match_statistics.played
                                ) >= 50 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {calculateWinRate(
                                  bracketData.season_match_statistics.won,
                                  bracketData.season_match_statistics.played
                                )}%
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </LoadingState>
  );
}

function CharacterProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <LoadingSkeleton className="h-10 w-64" />
              <LoadingSkeleton className="h-6 w-96" />
              <LoadingSkeleton className="h-4 w-48" />
            </div>
            <LoadingSkeleton className="h-32 w-32 rounded-lg" />
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <LoadingSkeleton className="h-6 w-24 mb-4" />
              <LoadingSkeleton className="h-8 w-16 mb-2" />
              <LoadingSkeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

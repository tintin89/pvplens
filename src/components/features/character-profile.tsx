'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  onBackToSearch?: () => void;
  onError?: (error: string) => void;
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

export function CharacterProfile({ characterName, realmSlug, region, onBackToSearch, onError }: CharacterProfileProps) {
  const { data, isLoading, error } = useFullCharacterData(realmSlug, characterName, region);

  // Handle errors by calling onError callback and not showing error in profile
  React.useEffect(() => {
    if (error && onError) {
      onError(error.message);
    }
  }, [error, onError]);

  // Don't render anything if there's an error - let the parent handle it
  if (error) {
    return null;
  }

  return (
    <LoadingState 
      isLoading={isLoading} 
      loadingComponent={<CharacterProfileSkeleton />}
    >
      {data && data.profile && (
        <div className="space-y-6">
          {/* Two-Column Layout with Character Model as Background */}
          <Card className="relative overflow-hidden w-full max-w-4xl mx-auto border border-white/10">
            {/* Character Model Background */}
            {data.media?.assets && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                style={{ 
                  backgroundImage: `url(${
                    // Try to find the character render (usually the largest/main image)
                    data.media.assets.find(asset => asset.key === 'main-raw')?.value ||
                    data.media.assets.find(asset => asset.key === 'main')?.value ||
                    data.media.assets[0]?.value ||
                    ''
                  })`,
                  backgroundPosition: 'center center'
                }}
              />
            )}
            
            <CardContent className="relative z-10 p-0">
              {/* Back Button */}
              {onBackToSearch && (
                <div className="p-6 pb-0">
                  <Button
                    onClick={onBackToSearch}
                    variant="outline"
                    className="flex items-center gap-2 bg-black/40 border-white/20 text-wow-gold hover:bg-black/60"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                  </Button>
                </div>
              )}
              
              <div className="flex">
                {/* Left Side: Character Info */}
                <div className="flex-1 p-8">
                  {/* Character Profile Info */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Class Icon Avatar */}
                    <div className="w-12 h-12 rounded-lg border-2 border-wow-gold/50 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/large/classicon_${data.profile.character_class.name.toLowerCase()}.jpg`}
                        alt={`${data.profile.character_class.name} class icon`}
                        className="w-8 h-8 rounded"
                        onError={(e) => {
                          // Fallback to a generic class icon if specific one fails
                          (e.target as HTMLImageElement).src = `https://wow.zamimg.com/images/wow/icons/medium/classicon_${data.profile.character_class.name.toLowerCase()}.jpg`;
                        }}
                      />
                    </div>
                    
                    {/* Character Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-wow-gold">
                          {data.profile.name}
                        </h1>
                        <Badge 
                          variant={data.profile.faction.type === 'ALLIANCE' ? 'alliance' : 'horde'}
                          className="text-xs"
                        >
                          {data.profile.faction.name}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-wow-gold/80">
                        <span>
                          Level {data.profile.level} 
                          <span 
                            className="ml-1 font-medium"
                            style={{ color: getClassColor(data.profile.character_class.name) }}
                          >
                            {data.profile.character_class.name}
                          </span>
                        </span>
                        <span>•</span>
                        <span>{data.profile.race.name}</span>
                      </div>
                      {data.profile.guild && (
                        <div className="text-wow-gold/70 text-xs">
                          &lt;{data.profile.guild.name}&gt;
                        </div>
                      )}
                      {data.profile.last_login_timestamp && (
                        <div className="text-wow-gold/60 text-xs">
                          Last seen: {formatRelativeTime(data.profile.last_login_timestamp)}
                        </div>
                      )}
                    </div>

                    {/* PvP Ranking Avatar */}
                    {data.pvp?.brackets && Object.keys(data.pvp.brackets).length > 0 && (() => {
                      // Find the highest rating across all brackets
                      const highestRating = Math.max(
                        ...Object.values(data.pvp.brackets).map((bracket: BracketData) => bracket.rating || 0)
                      );
                      const highestBracket = Object.values(data.pvp.brackets).find((bracket: BracketData) => bracket.rating === highestRating);
                      
                      // Check if this is Solo Shuffle and high enough rating for Forged Legend (top 0.1%)
                      const soloShuffleBracket = Object.entries(data.pvp.brackets).find(([bracketType, bracketData]) => 
                        bracketType.includes('shuffle') || bracketData.bracket?.slug?.includes('shuffle')
                      );
                      const isForgedLegend = soloShuffleBracket && soloShuffleBracket[1].rating >= 2400; // Typical top 0.1% threshold
                      
                      let highestTier;
                      if (isForgedLegend) {
                        highestTier = 'forged_legend';
                      } else {
                        highestTier = getRatingTierWithWins(highestRating, highestBracket?.season_match_statistics?.won || 0).toLowerCase();
                      }
                      
                      // PvP rank icon URLs using local images
                      const rankIcons = {
                        'forged_legend': '/images/forged_legend.webp',
                        'gladiator': '/images/gladiator.webp',
                        'elite': '/images/elite.webp',
                        'duelist': '/images/duelist.webp',
                        'rival': '/images/rival.webp',
                        'challenger': '/images/challenger.webp',
                        'combatant': '/images/challenger.webp', // Using challenger as fallback since no combatant image
                        'unranked': '/images/challenger.webp' // Using challenger as fallback since no unranked image
                      };

                      const displayTier = isForgedLegend ? 'Forged Legend' : highestTier.charAt(0).toUpperCase() + highestTier.slice(1);

                      return (
                        <div className="w-16 h-16 rounded-lg border-2 border-purple-500/50 flex items-center justify-center flex-shrink-0 bg-black/40">
                          <img 
                            src={rankIcons[highestTier as keyof typeof rankIcons] || rankIcons.challenger}
                            alt={`${displayTier} rank`}
                            className="w-12 h-12 rounded"
                            title={`Highest Rank: ${displayTier} (${highestRating} rating)${isForgedLegend ? ' - Top 0.1% Solo Shuffle' : ''}`}
                          />
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bracket Cards in Left Column */}
                  {data.pvp?.brackets && Object.keys(data.pvp.brackets).length > 0 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(data.pvp.brackets || {}).map(([bracketType, bracketData]: [string, BracketData]) => {
                          const bracketSlug = bracketData?.bracket?.slug || bracketData?.bracket_id || bracketType;
                          
                          return (
                            <div key={bracketType} className="border border-white/20 rounded-lg p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-wow-gold">
                                  {formatBracketName(bracketSlug)}
                                </h4>
                                <Badge 
                                  variant={getRatingTierWithWins(bracketData.rating, bracketData.season_match_statistics?.won || 0).toLowerCase() as 'gladiator' | 'elite' | 'duelist' | 'rival' | 'challenger' | 'combatant' | 'unranked'}
                                  className="text-sm"
                                >
                                  {getRatingTierWithWins(bracketData.rating, bracketData.season_match_statistics?.won || 0)}
                                </Badge>
                              </div>
                            
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-wow-gold/70">Rating:</span>
                                  <span 
                                    className={`font-bold text-lg ${getRatingColor(bracketData.rating)}`}
                                  >
                                    {bracketData.rating}
                                  </span>
                                </div>
                                
                                {bracketData.season_match_statistics && (
                                  <>
                                    <div className="flex items-center justify-between">
                                      <span className="text-wow-gold/70">W/L:</span>
                                      <span>
                                        <span className="text-green-400 font-medium">{bracketData.season_match_statistics.won}</span>
                                        /
                                        <span className="text-red-400 font-medium">{bracketData.season_match_statistics.lost}</span>
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-wow-gold/70">Win Rate:</span>
                                      <span className="text-wow-gold font-medium">
                                        {calculateWinRate(bracketData.season_match_statistics.won, bracketData.season_match_statistics.lost)}%
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </LoadingState>
  );
}

// Loading skeleton component
function CharacterProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <LoadingSkeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1">
              <LoadingSkeleton className="h-6 w-32 mb-1" />
              <LoadingSkeleton className="h-4 w-48 mb-1" />
              <LoadingSkeleton className="h-3 w-24 mb-1" />
              <LoadingSkeleton className="h-3 w-32" />
            </div>
            <LoadingSkeleton className="w-16 h-16 rounded-lg" />
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3].map((i) => (
                <LoadingSkeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

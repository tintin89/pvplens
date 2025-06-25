'use client';

import { CharacterSearch } from '@/components/features/character-search';
import { CharacterProfile } from '@/components/features/character-profile';
import { useState } from 'react';

export default function HomePage() {
  const [selectedCharacter, setSelectedCharacter] = useState<{
    name: string;
    realm: string;
    region: string;
  } | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const handleSearch = (characterName: string, realmSlug: string, region: string) => {
    setLastError(null); // Clear any previous errors
    setSelectedCharacter({
      name: characterName,
      realm: realmSlug,
      region,
    });
  };

  const handleBackToSearch = () => {
    setSelectedCharacter(null);
    setLastError(null);
  };

  const handleError = (error: string) => {
    setLastError(error);
    setSelectedCharacter(null); // Go back to search on error
  };

  return (
    <div className="min-h-screen hero-background">
      <div className="container mx-auto px-4 py-8">
        {/* Logo - Always Visible */}
        <div className="text-center mb-12 relative">
          {/* Fire Vapor Logo */}
          <div className="relative inline-block py-8">
            {/* Fire vapor effects */}
            <div className="absolute inset-0 -m-8">
              {/* Single focused flame behind swords */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-20 bg-gradient-to-t from-red-400/30 via-orange-300/20 to-yellow-200/10 rounded-full blur-lg fire-flicker"></div>
              
              {/* Vapor smoke rising */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-24 h-16 bg-gradient-to-t from-gray-400/10 via-gray-300/5 to-transparent rounded-full blur-xl vapor-rise delay-200"></div>
              <div className="absolute left-1/3 top-2 w-16 h-12 bg-gradient-to-t from-gray-300/8 via-gray-200/4 to-transparent rounded-full blur-lg vapor-rise delay-600"></div>
              <div className="absolute right-1/3 top-2 w-20 h-14 bg-gradient-to-t from-gray-400/8 via-gray-300/4 to-transparent rounded-full blur-lg vapor-rise delay-900"></div>
              
              {/* Floating embers */}
              <div className="absolute left-1/4 top-1/4 w-1 h-1 bg-orange-300 rounded-full ember-float delay-200"></div>
              <div className="absolute right-1/4 top-1/3 w-0.5 h-0.5 bg-red-300 rounded-full ember-float delay-800"></div>
              <div className="absolute left-2/3 top-1/2 w-1 h-1 bg-yellow-300 rounded-full ember-float delay-1200"></div>
              <div className="absolute right-1/3 top-2/3 w-0.5 h-0.5 bg-orange-200 rounded-full ember-float delay-400"></div>
            </div>
            
            {/* Main Logo Text */}
            <h1 className="relative z-10 text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Pv
              </span>
              <span className="bg-gradient-to-br from-blue-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                P
              </span>
              
              {/* Swords Symbol */}
              <span className="relative inline-block mx-2 text-3xl md:text-5xl">
                <span className="bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  ⚔
                </span>
              </span>
              
              <span className="bg-gradient-to-br from-red-300 via-red-400 to-orange-300 bg-clip-text text-transparent">
                LE
              </span>
              <span className="bg-gradient-to-br from-red-300 via-red-400 to-orange-300 bg-clip-text text-transparent">
                ns
              </span>
            </h1>
          </div>
        </div>

        {/* Content Card - Toggles between Search and Results */}
        <div className="max-w-4xl mx-auto">
          {!selectedCharacter ? (
            // Search Card
            <CharacterSearch onSearch={handleSearch} error={lastError} />
          ) : (
            // Results Card with Back Button
            <CharacterProfile
              characterName={selectedCharacter.name}
              realmSlug={selectedCharacter.realm}
              region={selectedCharacter.region}
              onBackToSearch={handleBackToSearch}
              onError={handleError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
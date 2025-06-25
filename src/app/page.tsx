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

  const handleSearch = (characterName: string, realmSlug: string, region: string) => {
    setSelectedCharacter({
      name: characterName,
      realm: realmSlug,
      region,
    });
  };

  return (
    <div className="min-h-screen hero-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-wow text-wow-gold mb-4">
            PVP Lens
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Track and analyze World of Warcraft PVP statistics for North American players
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          <CharacterSearch onSearch={handleSearch} />
          
          {selectedCharacter && (
            <CharacterProfile
              characterName={selectedCharacter.name}
              realmSlug={selectedCharacter.realm}
              region={selectedCharacter.region}
            />
          )}
        </div>
      </div>
    </div>
  );
}
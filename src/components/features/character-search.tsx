'use client';

import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useSearch } from '@/hooks';
import { isValidCharacterName, realmNameToSlug } from '@/utils';

interface CharacterSearchProps {
  onSearch: (characterName: string, realmSlug: string, region: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const popularRealms = [
  'Stormrage', 'Tichondrius', 'Mal\'Ganis', 'Illidan', 'Kil\'jaeden',
  'Emerald Dream', 'Dalaran', 'Sargeras', 'Frostmourne', 'Arthas'
];

const regions = [
  { value: 'us', label: 'North America' },
  { value: 'eu', label: 'Europe' },
  { value: 'kr', label: 'Korea' },
  { value: 'tw', label: 'Taiwan' }
];

export function CharacterSearch({ onSearch, isLoading = false, error }: CharacterSearchProps) {
  const [selectedRegion, setSelectedRegion] = useState('us');
  const [selectedRealm, setSelectedRealm] = useState('');
  const { value: characterName, setValue: setCharacterName } = useSearch('', 300);
  const [errors, setErrors] = useState<{ character?: string; realm?: string }>({});

  const validateForm = () => {
    const newErrors: { character?: string; realm?: string } = {};

    if (!characterName.trim()) {
      newErrors.character = 'Character name is required';
    } else if (!isValidCharacterName(characterName.trim())) {
      newErrors.character = 'Invalid character name format';
    }

    if (!selectedRealm.trim()) {
      newErrors.realm = 'Realm selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSearch = () => {
    if (validateForm()) {
      const realmSlug = realmNameToSlug(selectedRealm);
      onSearch(characterName.trim(), realmSlug, selectedRegion);
    }
  };

  const handleQuickRealmSelect = (realm: string) => {
    setSelectedRealm(realm);
    setErrors(prev => ({ ...prev, realm: undefined }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="space-y-6 pt-8">
        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-yellow-400">Region</label>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <Button
                key={region.value}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className={`justify-start ${
                  selectedRegion === region.value 
                    ? 'region-selected' 
                    : 'region-unselected'
                }`}
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Character Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-yellow-400">Character Name</label>
          <Input
            placeholder="Enter character name..."
            value={characterName}
            onChange={(e) => {
              setCharacterName(e.target.value);
              setErrors(prev => ({ ...prev, character: undefined }));
            }}
            onKeyPress={handleKeyPress}
            className={errors.character ? 'border-red-500/50' : ''}
          />
          {errors.character && (
            <p className="text-red-400 text-sm">{errors.character}</p>
          )}
        </div>

        {/* Realm Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-yellow-400">Realm</label>
          <Input
            placeholder="Enter realm name..."
            value={selectedRealm}
            onChange={(e) => {
              setSelectedRealm(e.target.value);
              setErrors(prev => ({ ...prev, realm: undefined }));
            }}
            onKeyPress={handleKeyPress}
            className={errors.realm ? 'border-red-500/50' : ''}
          />
          {errors.realm && (
            <p className="text-red-400 text-sm">{errors.realm}</p>
          )}
          
          {/* Popular Realms */}
          <div className="space-y-2">
            <p className="text-xs text-yellow-400/70">Popular Realms:</p>
            <div className="flex flex-wrap gap-1">
              {popularRealms.map((realm) => (
                <Button
                  key={realm}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickRealmSelect(realm)}
                  className={`h-7 px-2 py-1 text-xs transition-all duration-200 ${
                    selectedRealm === realm 
                      ? 'realm-button-selected' 
                      : 'popular-realm-button'
                  }`}
                >
                  {realm}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Error Display */}
        {error && (
          <div className="wow-card bg-red-500/10 border-red-500/30 p-4">
            <div className="text-red-400 font-medium mb-1">Search Error</div>
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Search Character
            </>
          )}
        </Button>

        {/* Quick Tips */}
        <div className="wow-card bg-black/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Quick Tips</span>
          </div>
          <ul className="text-xs text-white/70 space-y-1">
            <li>• Character names are case-sensitive</li>
            <li>• Make sure to select the correct realm</li>
            <li>• Only NA region is currently supported</li>
            <li>• Data updates every few minutes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

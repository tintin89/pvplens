'use client';

import React, { useState } from 'react';
import { Search, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSearch } from '@/hooks';
import { isValidCharacterName, realmNameToSlug } from '@/utils';

interface CharacterSearchProps {
  onSearch: (characterName: string, realmSlug: string, region: string) => void;
  isLoading?: boolean;
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

export function CharacterSearch({ onSearch, isLoading = false }: CharacterSearchProps) {
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
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-3xl font-bold wow-gradient-text">
          <Zap className="h-8 w-8 text-primary" />
          Character Lookup
        </CardTitle>
        <p className="text-white/70 mt-2">
          Search for World of Warcraft characters and view their PVP statistics
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Region Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Region</label>
          <div className="grid grid-cols-2 gap-2">
            {regions.map((region) => (
              <Button
                key={region.value}
                variant={selectedRegion === region.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedRegion(region.value)}
                className="justify-start"
              >
                {region.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Character Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Character Name</label>
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
          <label className="text-sm font-medium text-white">Realm</label>
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
            <p className="text-xs text-white/50">Popular Realms:</p>
            <div className="flex flex-wrap gap-1">
              {popularRealms.map((realm) => (
                <Button
                  key={realm}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickRealmSelect(realm)}
                  className="h-7 px-2 py-1 text-xs hover:bg-primary/20"
                >
                  {realm}
                </Button>
              ))}
            </div>
          </div>
        </div>

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

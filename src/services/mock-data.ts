// Mock data for development and testing
export const mockCharacterData = {
  profile: {
    id: 123456789,
    name: "Testcharacter",
    realm: {
      id: 52,
      name: "Stormrage",
      slug: "stormrage",
      category: "pvp",
      locale: "en_US",
      timezone: "America/New_York",
      type: {
        type: "normal",
        name: "Normal"
      },
      is_tournament: false,
      region: {
        id: 1,
        name: "North America"
      }
    },
    character_class: {
      id: 1,
      name: "Warrior",
      power_type: {
        id: 1,
        name: "Rage"
      },
      specializations: []
    },
    race: {
      id: 1,
      name: "Human",
      faction: {
        type: "ALLIANCE",
        name: "Alliance"
      }
    },
    gender: {
      type: "MALE",
      name: "Male"
    },
    faction: {
      type: "ALLIANCE",
      name: "Alliance"
    },
    level: 80,
    achievement_points: 15420,
    last_login_timestamp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    average_item_level: 589,
    equipped_item_level: 594,
    active_spec: {
      id: 71,
      name: "Arms",
      description: "A battle-hardened master of two-handed weapons.",
      role: {
        type: "DPS",
        name: "Damage"
      }
    }
  },  pvp: {
    honor_level: 500,
    honorable_kills: 2547,
    pvp_map_statistics: [
      {
        world_map: {
          id: 1,
          name: "Warsong Gulch"
        },
        match_statistics: {
          played: 45,
          won: 32,
          lost: 13
        }
      }
    ],    brackets: {
      "2v2": {
        href: "/api/pvp/2v2",
        bracket: {
          id: 1,
          type: "2v2",
          slug: "2v2"
        },
        rating: 2156,
        season_match_statistics: {
          played: 89,
          won: 62,
          lost: 27
        },
        tier: {
          id: 3,
          name: "Duelist",
          min_rating: 1800,
          max_rating: 2099,
          color: {
            r: 0,
            g: 112,
            b: 221,
            a: 1
          }
        }
      },
      "3v3": {
        href: "/api/pvp/3v3",
        bracket: {
          id: 2,
          type: "3v3",
          slug: "3v3"
        },
        rating: 2401,
        season_match_statistics: {
          played: 156,
          won: 98,
          lost: 58
        },
        tier: {
          id: 5,
          name: "Gladiator",
          min_rating: 2400,
          max_rating: 9999,
          color: {
            r: 163,
            g: 53,
            b: 238,
            a: 1
          }
        }
      }
    }
  },
  media: {
    assets: [
      {
        key: "avatar",
        value: "https://render.worldofwarcraft.com/us/character/stormrage/123/456789-avatar.jpg"
      },
      {
        key: "main",
        value: "https://render.worldofwarcraft.com/us/character/stormrage/123/456789-main.jpg"
      }
    ]
  }
};

export const mockSearchResults = [
  {
    name: "Testcharacter",
    realm: "stormrage",
    level: 80,
    class: "Warrior",
    race: "Human",
    faction: "Alliance",
    guild: "Test Guild"
  },
  {
    name: "Anothertoon",
    realm: "stormrage", 
    level: 80,
    class: "Paladin",
    race: "Human",
    faction: "Alliance",
    guild: "Elite Raiders"
  }
];

export const mockLeaderboardData = [
  {
    rank: 1,
    rating: 3127,
    character: {
      name: "Topplayer",
      realm: "mal-ganis",
      class: "Death Knight",
      race: "Orc",
      faction: "Horde"
    },
    seasonWins: 234,
    seasonLosses: 45
  },
  {
    rank: 2,
    rating: 3089,
    character: {
      name: "Secondbest",
      realm: "tichondrius",
      class: "Demon Hunter",
      race: "Night Elf",
      faction: "Alliance"
    },
    seasonWins: 198,
    seasonLosses: 52
  }
];

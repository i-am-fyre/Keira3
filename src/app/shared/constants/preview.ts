export const SIDE = {
  '-1': 'Alliance only',
  '-2': 'Horde only',
  0: null,
  1: 'Alliance',
  2: 'Horde',
  3: 'Both',
};

export enum CLASSES {
  WARRIOR = 0x001,
  PALADIN = 0x002,
  HUNTER = 0x004,
  ROGUE = 0x008,
  PRIEST = 0x010,
  DEATHKNIGHT = 0x020,
  SHAMAN = 0x040,
  MAGE = 0x080,
  WARLOCK = 0x100,
  DRUID = 0x400,
  MASK_ALL = 0x5ff,
}

export enum RACE {
  HUMAN = 0x001,
  ORC = 0x002,
  DWARF = 0x004,
  NIGHTELF = 0x008,
  UNDEAD = 0x010,
  TAUREN = 0x020,
  GNOME = 0x040,
  TROLL = 0x080,
  BLOODELF = 0x200,
  DRAENEI = 0x400,
  WORGEN = 0x200000,
  MASK_ALLIANCE_0 = 0x04d,
  MASK_ALLIANCE_1_2 = 0x44d,
  MASK_ALLIANCE_3 = 0x20044d,
  MASK_HORDE_0 = 0x0b2,
  MASK_HORDE_1_2 = 0x2b2,
  MASK_HORDE_3 = 0x3b2,
  MASK_ALL_0 = 0x0ff,
  MASK_ALL_1_2 = 0x6ff,
  MASK_ALL_3 = 0x1ff2e7,
}
// ChrClasses.dbc
export const CLASSES_TEXT = [
  null,
  'Warrior',
  'Paladin',
  'Hunter',
  'Rogue',
  'Priest',
  'Death Knight',
  'Shaman',
  'Mage',
  'Warlock',
  null,
  'Druid',
];

// ChrRaces.dbc
export const RACES_TEXT = {
  '-2': 'Horde',
  '-1': 'Alliance',
  0: null,
  1: 'Human',
  2: 'Orc',
  3: 'Dwarf',
  4: 'Night Elf',
  5: 'Undead',
  6: 'Tauren',
  7: 'Gnome',
  8: 'Troll',
  9: null,
  10: 'Blood Elf',
  11: 'Draenei',
};

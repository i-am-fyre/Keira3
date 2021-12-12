import { Flag } from '../../types/general';

// Goblin shows up as early as M0, but is not used for race selection until M3.
// Fel Orc, Naga, Broken, Skeleton, Vrykul, Tuskarr, Forest Troll, Taunka, Northrend Skeleton, and Ice Troll are not utilized for allowable races.
export const ALLOWABLE_RACES: Flag[] = [
  { bit: 0, core: 0, name: 'Human' },
  { bit: 1, core: 0, name: 'Orc' },
  { bit: 2, core: 0, name: 'Dwarf' },
  { bit: 3, core: 0, name: 'Night Elf' },
  { bit: 4, core: 0, name: 'Undead' },
  { bit: 5, core: 0, name: 'Tauren' },
  { bit: 6, core: 0, name: 'Gnome' },
  { bit: 7, core: 0, name: 'Troll' },
  { bit: 8, core: 3, name: 'Goblin' },
  { bit: 9, core: 1, name: 'Blood Elf' },
  { bit: 10, core: 1, name: 'Draenei' },
  // { bit: 11, core: 1, name: 'Fel Orc' },
  // { bit: 12, core: 1, name: 'Naga' },
  // { bit: 13, core: 1, name: 'Broken' },
  // { bit: 14, core: 1, name: 'Skeleton' },
  // { bit: 15, core: 2, name: 'Vrykul' },
  // { bit: 16, core: 2, name: 'Tuskarr' },
  // { bit: 17, core: 2, name: 'Forest Troll' },
  // { bit: 18, core: 2, name: 'Taunka' },
  // { bit: 19, core: 2, name: 'Northrend Skeleton' },
  // { bit: 20, core: 2, name: 'Ice Troll' },
  { bit: 21, core: 3, name: 'Worgen' },
];

import { Flag } from '../../types/general';

export const ALLOWABLE_CLASSES: Flag[] = [
  { bit: 0, core: 0, name: 'Warrior' },
  { bit: 1, core: 0, name: 'Paladin' },
  { bit: 2, core: 0, name: 'Hunter' },
  { bit: 3, core: 0, name: 'Rogue' },
  { bit: 4, core: 0, name: 'Priest' },
  { bit: 5, core: 2, name: 'Death Knight' },
  { bit: 6, core: 0, name: 'Shaman' },
  { bit: 7, core: 0, name: 'Mage' },
  { bit: 8, core: 0, name: 'Warlock' },
  // { bit: 9, core: 0, name: 'UNUSED' },
  { bit: 10, core: 0, name: 'Druid' },
];

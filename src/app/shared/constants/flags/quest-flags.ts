import { Flag } from '../../types/general';

export const QUEST_FLAG_SHARABLE = 0x00008;

export const QUEST_FLAGS: Flag[] = [
  { bit: 0, core: 0, name: 'STAY_ALIVE - If the character dies, the quest will fail' },
  { bit: 1, core: 0, name: 'PARTY_ACCEPT - If the character is grouped, all players that can accept this quest will receive confirmation box to accept quest',},
  { bit: 2, core: 0, name: 'EXPLORATION - Quest requires the character to explore a zone' },
  { bit: 3, core: 0, name: 'SHARABLE - Quest may be shared with other characters' },
  { bit: 4, core: 0, name: 'UNUSED1' },
  { bit: 5, core: 0, name: 'EPIC - Epic class quests' },
  { bit: 6, core: 0, name: 'RAID - Raid quests' },
  { bit: 7, core: 0, name: 'UNUSED2' },
  { bit: 8, core: 0, name: 'UNK2 - Not used currently: DELIVERMORE Quest needs more than normal q-item drops from mobs' },
  { bit: 9, core: 0, name: 'HIDDEN_REWARDS - Items and money rewarded only sent in SMSG_QUESTGIVER_OFFER_REWARD (not in SMSG_QUESTGIVER_QUEST_DETAILS or in client quest log(SMSG_QUEST_QUERY_RESPONSE))',},
  { bit: 10, core: 0, name: 'AUTO_REWARDED - These quests are automatically rewarded on quest complete and they will never appear in quest log client side.' },
];

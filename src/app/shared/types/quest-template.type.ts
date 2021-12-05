import { TableRow } from './general';

export const QUEST_TEMPLATE_TABLE = 'quest_template';
export const QUEST_TEMPLATE_ENTRY = 'entry';
export const QUEST_TEMPLATE_NAME = 'Title';
export const QUEST_TEMPLATE_CUSTOM_STARTING_ID = 90_000;
export const QUEST_TEMPLATE_SEARCH_FIELDS = [QUEST_TEMPLATE_ENTRY, QUEST_TEMPLATE_NAME];

export class QuestTemplate0 extends TableRow {
  entry: number = 0;
  Method: number = 0;
  ZoneOrSort: number = 0;
  MinLevel: number = 0;
  QuestLevel: number = 0;
  Type: number = 0;
  Title: string = '';
}

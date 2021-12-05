import { Injectable } from '@angular/core';

import { QuestTemplateService } from '../quest-template/quest-template.service';
import { QuestHandlerService } from '../quest-handler.service';
import { PreviewHelperService } from '@keira-shared/services/preview-helper.service';
import { QUEST_FLAG_SHARABLE } from '@keira-shared/constants/flags/quest-flags';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { EditorService } from '@keira-shared/abstract/service/editors/editor.service';
import { TableRow } from '@keira-types/general';
import { Quest, QuestReputationReward } from './quest-preview.model';
import { QuestTemplate0 } from '@keira-shared/types/quest-template.type';
import { DifficultyLevel } from './quest-preview.model';
import { RACES_TEXT, CLASSES_TEXT } from '@keira-shared/constants/preview';
import { SqliteQueryService } from '@keira-shared/services/sqlite-query.service';
import {
  QUEST_FLAG_DAILY,
  QUEST_FLAG_WEEKLY,
  QUEST_FLAG_SPECIAL_MONTHLY,
  QUEST_FLAG_REPEATABLE,
  QUEST_FLAG_SPECIAL_REPEATABLE,
  ICON_SKILLS,
  QUEST_PERIOD,
} from '@keira-shared/constants/quest-preview';
import { QUEST_INFO } from '@keira-shared/constants/options/quest-info';

@Injectable()
export class QuestPreviewService {
  showPreview = true;

  private prevSerieCache: Promise<Quest[]>[] = [];
  private nextSerieCache: Promise<Quest[]>[] = [];
  private nextSerieUsingPrevCache: Promise<Quest[]>[] = [];

  constructor(
    private readonly helperService: PreviewHelperService,
    public readonly mysqlQueryService: MysqlQueryService,
    public readonly sqliteQueryService: SqliteQueryService,
    private readonly questHandlerService: QuestHandlerService,
    private readonly questTemplateService: QuestTemplateService,
  ) {}

  readonly RACES_TEXT = RACES_TEXT;
  readonly CLASSES_TEXT = CLASSES_TEXT;
  readonly QUEST_INFO = QUEST_INFO;
  readonly ICON_SKILLS = ICON_SKILLS;

  // get form value
  get questTemplate(): QuestTemplate0 {
    return this.questTemplateService.form.getRawValue();
  }

  // get QuestTemplate0 values
  get entry(): number {
    return this.questTemplate.entry;
  }
  get title(): string {
    return this.questTemplate.Title;
  }
  get level(): string {
    return String(this.questTemplate.QuestLevel);
  }
  get minLevel(): string {
    return String(this.questTemplate.MinLevel);
  }
  // get side(): string {
  //   return this.helperService.getFactionFromRace(this.questTemplate.RequiredRaces);
  // }
  // get races(): number[] {
  //   return this.helperService.getRaceString(this.questTemplate.RequiredRaces);
  // }
  // get sharable(): string {
  //   return this.questTemplate.QuestFlags & QUEST_FLAG_SHARABLE ? 'Sharable' : 'Not sharable';
  // }
  // get SrcItemId(): number {
  //   return this.questTemplate.SrcItemId;
  // }
  // get SrcItemIdName$(): Promise<string> {
  //   return this.mysqlQueryService.getItemNameById(this.SrcItemId);
  // }
  // get objectiveText(): string {
  //   return this.questTemplate.Objectives;
  // }
  // get rewardMoney(): number {
  //   return this.questTemplate.RewOrReqMoney;
  // }
  // get RewMoneyMaxLevel(): number {
  //   return this.questTemplate.RewMoneyMaxLevel;
  // }

  // Item Quest Starter
  get questGivenByItem$(): Promise<string> {
    return this.mysqlQueryService.getItemByStartQuest(this.questTemplate.entry);
  }
  get questStarterItem$(): Promise<string> {
    return this.mysqlQueryService.getItemNameByStartQuest(this.questTemplate.entry);
  }

  // Quest Serie & relations
  // get prevQuestList$(): Promise<Quest[]> {
  //   return this.getPrevQuestListCached();
  // }
  // get nextQuestList$(): Promise<Quest[]> {
  //   return this.getNextQuestListCached();
  // }
  // get enabledByQuestId(): number {
  //   return this.getEnabledByQuestId();
  // }
  // get enabledByQuestTitle$(): Promise<string> {
  //   return this.getEnabledByQuestName();
  // }

  get difficultyLevels(): DifficultyLevel {
    return this.getDifficultyLevels();
  }

  initializeServices() {
    this.initService(this.questTemplateService);
  }

  private initService<T extends TableRow>(service: EditorService<T>) {
    if (!!this.questHandlerService.selected && service.loadedEntityId !== this.questHandlerService.selected) {
      service.reload(this.questHandlerService.selected);
    }
  }

  private getDifficultyLevels(): DifficultyLevel {
    if (this.questTemplate.QuestLevel > 0) {
      const levels: DifficultyLevel = {};

      // red
      if (this.questTemplate.MinLevel && this.questTemplate.MinLevel < this.questTemplate.QuestLevel - 4) {
        levels.red = this.questTemplate.MinLevel;
      }

      // orange
      if (!this.questTemplate.MinLevel || this.questTemplate.MinLevel < this.questTemplate.QuestLevel - 2) {
        levels.orange =
          Object.keys(levels).length === 0 && this.questTemplate.MinLevel > this.questTemplate.QuestLevel - 4
            ? this.questTemplate.MinLevel
            : this.questTemplate.QuestLevel - 4;
      }

      // yellow
      levels.yellow =
        Object.keys(levels).length === 0 && this.questTemplate.MinLevel > this.questTemplate.QuestLevel - 2
          ? this.questTemplate.MinLevel
          : this.questTemplate.QuestLevel - 2;

      // green
      levels.green = this.questTemplate.QuestLevel + 3;

      // grey (is about +/-1 level off)
      levels.grey = this.questTemplate.QuestLevel + 3 + Math.ceil((12 * this.questTemplate.QuestLevel) / 80);

      return levels;
    }

    return null;
  }

  // get periodicQuest(): string {
  //   return this.getPeriodicQuest();
  // }

  // private getPeriodicQuest(): QUEST_PERIOD {
  //   const flags = this.questTemplate.QuestFlags;
  //   const specialFlags = this.questTemplate.SpecialFlags;

  //   if (flags & QUEST_FLAG_DAILY) {
  //     return QUEST_PERIOD.DAILY;
  //   }

  //   if (flags & QUEST_FLAG_WEEKLY) {
  //     return QUEST_PERIOD.WEEKLY;
  //   }

  //   if (specialFlags & QUEST_FLAG_SPECIAL_MONTHLY) {
  //     return QUEST_PERIOD.MONTHLY;
  //   }

  //   return null;
  // }

  // private async getPrevQuestList(prev: number): Promise<Quest[]> {
  //   const array: Quest[] = [];

  //   while (!!prev && prev > 0) {
  //     // when < 0 it's "enabled by"
  //     array.push({
  //       entry: prev,
  //       Title: await this.mysqlQueryService.getQuestTitleById(prev),
  //     });

  //     prev = Number(await this.mysqlQueryService.getPrevQuestById(prev));
  //   }

  //   return array.reverse();
  // }

  // private getPrevQuestListCached(): Promise<Quest[]> {
  //   const id = this.questTemplate.entry; //this is incorrect - just a dummy value for now, correct later.

  //   if (!this.prevSerieCache[id]) {
  //     this.prevSerieCache[id] = this.getPrevQuestList(id);
  //   }

  //   return this.prevSerieCache[id];
  // }

  // private async getNextQuestListUsingNext(next: number): Promise<Quest[]> {
  //   const array: Quest[] = [];

  //   while (!!next) {
  //     array.push({
  //       entry: next,
  //       Title: await this.mysqlQueryService.getQuestTitleById(next),
  //     });

  //     next = Number(await this.mysqlQueryService.getNextQuestById(next));
  //   }

  //   return array;
  // }

  // private async getNextQuestListUsingPrev(current: number): Promise<Quest[]> {
  //   const array: Quest[] = [];

  //   while (!!current) {
  //     const next = Number(await this.mysqlQueryService.getNextQuestById(current, true));

  //     if (!!next) {
  //       array.push({
  //         entry: next,
  //         Title: await this.mysqlQueryService.getQuestTitleById(next),
  //       });
  //     }

  //     current = next;
  //   }

  //   return array;
  // }

  // private getNextQuestListCached(): Promise<Quest[]> {
  //   const next = this.questTemplate.entry; // this is incorrect - just a dummy value for now, correct later.

  //   if (!!next) {
  //     // if a NextQuestID is specified, we calculate the chain using that

  //     if (!this.nextSerieCache[next]) {
  //       this.nextSerieCache[next] = this.getNextQuestListUsingNext(next);
  //     }

  //     return this.nextSerieCache[next];
  //   }

  //   // otherwise, we calculate the chain using the PrevQuestID of the next
  //   const id = this.entry;
  //   if (!this.nextSerieUsingPrevCache[id]) {
  //     this.nextSerieUsingPrevCache[id] = this.getNextQuestListUsingPrev(id);
  //   }

  //   return this.nextSerieUsingPrevCache[id];
  // }

  // private getEnabledByQuestId(): number {
  //   return this.questTemplateAddon.PrevQuestID < 0 ? -this.questTemplateAddon.PrevQuestID : 0;
  // }

  // private getEnabledByQuestName(): Promise<string> {
  //   return this.mysqlQueryService.getQuestTitleById(this.getEnabledByQuestId());
  // }

  // public isUnavailable(): boolean {
  //   const UNAVAILABLE = 0x04000;
  //   return (this.questTemplate.QuestFlags & UNAVAILABLE) === UNAVAILABLE;
  // }

  // public isRepeatable(): boolean {
  //   return !!(this.questTemplate.QuestFlags & QUEST_FLAG_REPEATABLE || this.questTemplate.SpecialFlags & QUEST_FLAG_SPECIAL_REPEATABLE);
  // }

  // get requiredSkill$(): Promise<string> {
  //   return this.sqliteQueryService.getSkillNameById(Number(this.questTemplateAddon.RequiredSkillID));
  // }

  // getRepReward$(field: number | string): Promise<QuestReputationReward[]> {
  //   return this.mysqlQueryService.getReputationRewardByFaction(this.questTemplate[`RewRepFaction${field}`]);
  // }

  // getRewardReputation(field: string | number, reputationReward: QuestReputationReward[]): number {
  //   const faction = this.questTemplate[`RewRepFaction${field}`];
  //   const value = this.questTemplate[`RewRepValue${field}`];

  //   if (!faction || !value) {
  //     return null;
  //   }

  //   if (!!reputationReward && !!reputationReward[0]) {
  //     const dailyType = this.getPeriodicQuest();

  //     if (!!dailyType) {
  //       if (dailyType === QUEST_PERIOD.DAILY && reputationReward[0].quest_daily_rate !== 1) {
  //         return Number(value) * (reputationReward[0].quest_daily_rate - 1);
  //       }

  //       if (dailyType === QUEST_PERIOD.WEEKLY && reputationReward[0].quest_weekly_rate !== 1) {
  //         return Number(value) * (reputationReward[0].quest_weekly_rate - 1);
  //       }

  //       if (dailyType === QUEST_PERIOD.MONTHLY && reputationReward[0].quest_monthly_rate !== 1) {
  //         return Number(value) * (reputationReward[0].quest_monthly_rate - 1);
  //       }
  //     }

  //     if (this.isRepeatable() && reputationReward[0].quest_repeatable_rate !== 1) {
  //       return Number(value) * (reputationReward[0].quest_repeatable_rate - 1);
  //     }

  //     if (reputationReward[0].quest_rate !== 1) {
  //       return Number(value) * (reputationReward[0].quest_rate - 1);
  //     }
  //   }

  //   return Number(value);
  // }

  getObjText(field: string | number) {
    return this.questTemplate[`ObjectiveText${field}`];
  }

  getObjective$(field: string | number): Promise<string> {
    const ReqCreatureOrGOId = Number(this.questTemplate[`ReqCreatureOrGOId${field}`]);
    if (!!ReqCreatureOrGOId) {
      if (ReqCreatureOrGOId > 0) {
        return this.mysqlQueryService.getCreatureNameById(ReqCreatureOrGOId);
      }

      return this.mysqlQueryService.getGameObjectNameById(Math.abs(ReqCreatureOrGOId));
    }
  }

  getObjectiveCount(field: string | number): string {
    const reqNpcOrGo = this.questTemplate[`ReqCreatureOrGOCount${field}`];
    return !!reqNpcOrGo && reqNpcOrGo > 1 ? `(${reqNpcOrGo})` : '';
  }

  isNpcOrGoObj(field: string | number): boolean {
    return !!this.questTemplate[`ReqCreatureOrGOCount${field}`];
    // return !!this.questTemplate[`ObjectiveText${field}`] || !!this.questTemplate[`ReqCreatureOrGOId${field}`];
  }

  getObjItemCount(field: string | number) {
    const reqItemCount = this.questTemplate[`ReqItemCount${field}`];
    return !!reqItemCount && reqItemCount > 1 ? `(${reqItemCount})` : '';
  }

  getFactionByValue(field: string | number) {
    switch (Number(this.questTemplate[`RepObjectiveValue${field}`])) {
      case 900:
      case 2100:
        return '(Neutral)';
      case 3000:
        return '(Friendly)';
      case 9000:
        return '(Honored)';
      case 21000:
        return '(Revered)';
      case 42000:
        return '(Exalted)';
      default:
        return '';
    }
  }

  isFieldAvailable(field: string, fieldAmount: string, idx: string | number): boolean {
    return !!this.questTemplate[`${field}${idx}`] && this.questTemplate[`${fieldAmount}${idx}`] > 0;
  }

  isRewardReputation(): boolean {
    return (
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 1) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 2) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 3) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 4) ||
      this.isFieldAvailable('RewRepFaction', 'RewRepValue', 5)
    );
  }

  isGains(): boolean {
    return this.isRewardReputation();
  }

  isRewItemIds(): boolean {
    return (
      this.isFieldAvailable('RewItemId', 'RewItemCount', 1) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 2) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 3) ||
      this.isFieldAvailable('RewItemId', 'RewItemCount', 4)
    );
  }

  isRewardChoiceItems(): boolean {
    return (
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 1) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 2) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 3) ||
      this.isFieldAvailable('RewChoiceItemId', 'RewChoiceItemCount', 4)
    );
  }

  // isRewOrReqMoney(): boolean {
  //   return this.rewardMoney > 0;
  // }

  // isRewMoneyMaxLevel(): boolean {
  //   return this.RewMoneyMaxLevel > 0;
  // }

  // isReward(): boolean {
  //   return this.isRewItemIds() || this.isRewardChoiceItems() || !!this.RewSpell() || this.isRewOrReqMoney() || this.isRewMoneyMaxLevel();
  // }

  // RewSpell(): number {
  //   if (!!this.questTemplate.RewSpell) {
  //     return this.questTemplate.RewSpell;
  //   }

  //   if (!!this.questTemplate.RewSpellCast) {
  //     return this.questTemplate.RewSpellCast;
  //   }

  //   return null;
  // }
}

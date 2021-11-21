import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import Spy = jasmine.Spy;

import { QuestPreviewComponent } from './quest-preview.component';
import { QuestModule } from '../quest.module';
import { RouterTestingModule } from '@angular/router/testing';
import { QuestPreviewService } from './quest-preview.service';
import { PageObject } from '@keira-shared/testing/page-object';
import { QuestTemplate0 } from '@keira-shared/types/quest-template.type';
import { QuestTemplateAddon } from '@keira-shared/types/quest-template-addon.type';
import { createMockObject } from '@keira-shared/utils/helpers';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { SqliteQueryService } from '@keira-shared/services/sqlite-query.service';
import { QuestRequestItems } from '@keira-types/quest-request-items.type';
import { QuestOfferReward } from '@keira-types/quest-offer-reward.type';
import { ToastrModule } from 'ngx-toastr';

class QuestPreviewComponentPage extends PageObject<QuestPreviewComponent> {
  get title() {
    return this.query<HTMLHeadElement>('#title');
  }
  get level() {
    return this.query<HTMLParagraphElement>('#level');
  }
  get minLevel() {
    return this.query<HTMLParagraphElement>('#minlevel');
  }
  get creatureQuestStartIcon() {
    return this.query<HTMLImageElement>('#creatureQuestStartIcon');
  }
  get creatureQuestEndIcon() {
    return this.query<HTMLImageElement>('#creatureQuestEndIcon');
  }
  get Type() {
    return this.query<HTMLParagraphElement>('#type');
  }
  get classes() {
    return this.query<HTMLParagraphElement>('#classes');
  }
  get requiredSkill() {
    return this.query<HTMLParagraphElement>('#requiredSkill');
  }
  get rewardXP() {
    return this.query<HTMLParagraphElement>('#rewardXP');
  }
  get rewardTalents() {
    return this.query<HTMLParagraphElement>('#rewardTalents');
  }
  get rewardReputations() {
    return this.query<HTMLParagraphElement>('#rewardReputations');
  }
  get providedItem() {
    return this.query<HTMLParagraphElement>('#provided-item');
  }
  get npcOrGoObjectives() {
    return this.query<HTMLParagraphElement>('#npcOrGoObjectives');
  }
  get itemObjectives() {
    return this.query<HTMLParagraphElement>('#itemObjectives');
  }
  get RequiredFaction() {
    return this.query<HTMLParagraphElement>('#RequiredFaction');
  }
  get requiredMoney() {
    return this.query<HTMLDivElement>('#required-money', false);
  }
  get rewardMoney() {
    return this.query<HTMLDivElement>('#reward-money', false);
  }
  get RewMoneyMaxLevel() {
    return this.query<HTMLDivElement>('#reward-bonus-money', false);
  }
  get RewSpell() {
    return this.query<HTMLDivElement>('#RewSpell', false);
  }
  get RewItemIds() {
    return this.query<HTMLDivElement>('#reward-items', false);
  }
  get rewardChoiceItems() {
    return this.query<HTMLDivElement>('#reward-choice-items', false);
  }

  get descriptionText() {
    return this.query<HTMLDivElement>('#description-text');
  }
  get progressText() {
    return this.query<HTMLDivElement>('#progress-text');
  }
  get completionText() {
    return this.query<HTMLDivElement>('#completion-text');
  }
  get descriptionToggle() {
    return this.query<HTMLParagraphElement>('#description-toggle');
  }
  get progressToggle() {
    return this.query<HTMLParagraphElement>('#progress-toggle');
  }
  get completionToggle() {
    return this.query<HTMLParagraphElement>('#completion-toggle');
  }

  expectCollapsed(element: HTMLElement) {
    expect(this.queryInsideElement(element, 'i')).toHaveClass('fa-caret-right');
  }
  expectNotCollapsed(element: HTMLElement) {
    expect(this.queryInsideElement(element, 'i')).toHaveClass('fa-caret-down');
  }

  getRaces(assert = true) {
    return this.query<HTMLParagraphElement>('#races', assert);
  }
}

describe('QuestPreviewComponent', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QuestPreviewComponent],
        imports: [ToastrModule.forRoot(), RouterTestingModule, QuestModule],
      }).compileComponents();
    }),
  );

  function setup() {
    const service = TestBed.inject(QuestPreviewService);
    const fixture: ComponentFixture<QuestPreviewComponent> = TestBed.createComponent(QuestPreviewComponent);
    const component: QuestPreviewComponent = fixture.componentInstance;
    const page = new QuestPreviewComponentPage(fixture);
    const mysqlQueryService = TestBed.inject(MysqlQueryService);
    const sqliteQueryService = TestBed.inject(SqliteQueryService);

    return { fixture, component, service, page, mysqlQueryService, sqliteQueryService };
  }

  it('ngOnInit should initialise services', () => {
    const { fixture, service, page } = setup();
    const initializeServicesSpy: Spy = spyOn(service, 'initializeServices');

    fixture.detectChanges();

    expect(initializeServicesSpy).toHaveBeenCalledTimes(1);
    page.removeElement();
  });

  it('should show title, level and required level', () => {
    const title = 'MyTitle';
    const level = '77';
    const minLevel = '75';
    const maxLevel = '80';
    const { fixture, service, page } = setup();
    spyOnProperty(service, 'title', 'get').and.returnValue(title);
    spyOnProperty(service, 'level', 'get').and.returnValue(level);
    spyOnProperty(service, 'minLevel', 'get').and.returnValue(minLevel);
    spyOnProperty(service, 'maxLevel', 'get').and.returnValue(maxLevel);

    fixture.detectChanges();

    expect(page.title.innerText).toContain(title);
    expect(page.level.innerText).toContain(level);
    expect(page.minLevel.innerText).toContain(`${minLevel} - ${maxLevel}`);
    page.removeElement();
  });

  it('should show questStart and questEnd icons', () => {
    const { fixture, service, page } = setup();
    const periodicQuestSpy = spyOnProperty(service, 'periodicQuest', 'get').and.returnValue('');
    spyOnProperty(service, 'creatureQueststarterList', 'get').and.returnValue([{ id: 123, quest: 123 }]);
    spyOnProperty(service, 'creatureQuestenderList', 'get').and.returnValue([{ id: 123, quest: 123 }]);

    fixture.detectChanges();

    expect(page.creatureQuestStartIcon.src).toContain('assets/img/quest/quest_start.gif');
    expect(page.creatureQuestEndIcon.src).toContain('assets/img/quest/quest_end.gif');

    periodicQuestSpy.and.returnValue('Daily');

    fixture.detectChanges();

    expect(page.creatureQuestStartIcon.src).toContain('assets/img/quest/quest_start_daily.gif');
    expect(page.creatureQuestEndIcon.src).toContain('assets/img/quest/quest_end_daily.gif');
    page.removeElement();
  });

  it('should show Type', () => {
    const { fixture, service, page } = setup();
    const questTemplate = createMockObject({ QuestInfoID: 41 }, QuestTemplate0);
    spyOnProperty(service, 'periodicQuest', 'get').and.returnValue('Daily');
    spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);

    fixture.detectChanges();

    expect(page.Type.innerText).toContain('Daily');
    expect(page.Type.innerText).toContain('PvP');
    page.removeElement();
  });

  it('should show showRaces', () => {
    const { fixture, service, page } = setup();
    const sideSpy = spyOnProperty(service, 'side', 'get').and.returnValue('');
    spyOnProperty(service, 'races', 'get').and.returnValue([2, 4]);

    fixture.detectChanges();

    expect(page.getRaces().innerText).toContain('Orc');
    expect(page.getRaces().innerText).toContain('Night Elf');

    // in case of "Side"
    sideSpy.and.returnValue('Alliance');
    fixture.detectChanges();
    expect(page.getRaces(false)).toBeFalsy();
    page.removeElement();
  });

  it('should show showClasses', () => {
    const { fixture, service, page } = setup();
    spyOnProperty(service, 'classes', 'get').and.returnValue([2, 4]);

    fixture.detectChanges();

    expect(page.classes.innerText).toContain('Paladin');
    expect(page.classes.innerText).toContain('Rogue');
    page.removeElement();
  });

  it('should show required skill', async () => {
    const { fixture, service, page } = setup();
    spyOnProperty(service, 'requiredSkill$', 'get').and.returnValue(Promise.resolve('Jewelcrafting'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.requiredSkill.innerText).toContain('Jewelcrafting');

    const questTemplateAddon = createMockObject({ RequiredSkillPoints: 10 }, QuestTemplateAddon);
    spyOnProperty(service, 'questTemplateAddon', 'get').and.returnValue(questTemplateAddon);

    fixture.detectChanges();
    expect(page.requiredSkill.innerText).toContain('(10)');
    page.removeElement();
  });

  it('should show provided item (start item)', async () => {
    const { fixture, service, page } = setup();
    const mockSrcItemId = 123456;
    const mockSrcItemIdName = 'Sword of AzerothCore';
    spyOnProperty(service, 'SrcItemId', 'get').and.returnValue(mockSrcItemId);
    spyOnProperty(service, 'SrcItemIdName$', 'get').and.returnValue(Promise.resolve(mockSrcItemIdName));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(page.providedItem.innerText).toContain(`[${mockSrcItemId}]`);
    expect(page.providedItem.innerText).toContain(mockSrcItemIdName);
    page.removeElement();
  });

  it('should show RewardTalents', () => {
    const { fixture, page, service } = setup();
    const questTemplate = createMockObject({ RewardTalents: 2 }, QuestTemplate0);
    spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);

    fixture.detectChanges();

    expect(page.rewardTalents.innerText).toContain('2 talent points');
    fixture.debugElement.nativeElement.remove();
  });

  it('should show rewardReputations', () => {
    const { fixture, page, service } = setup();
    const questTemplate = createMockObject({ RewRepFaction1: 72, RewRepValue1: 123 }, QuestTemplate0);
    spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);

    fixture.detectChanges();

    expect(page.rewardReputations.innerText).toContain('123');
    fixture.debugElement.nativeElement.remove();
  });

  it('should show npcOrGoObjectives', async () => {
    const { fixture, page, service } = setup();
    const getObjectiveCountSpy: Spy = spyOn(service, 'getObjectiveCount').and.returnValue('(1)');
    const getObjTextSpy: Spy = spyOn(service, 'getObjText').and.returnValue('Mock Objective');
    spyOn(service, 'getObjective$').and.returnValue(Promise.resolve('Riverpaw Gnoll'));
    spyOn(service, 'isNpcOrGoObj').and.returnValue(true);

    fixture.detectChanges();
    expect(page.npcOrGoObjectives.innerText).toContain('Mock Objective (1)');

    getObjectiveCountSpy.and.returnValue('');

    fixture.detectChanges();
    expect(page.npcOrGoObjectives.innerText).toContain('Mock Objective');

    getObjTextSpy.and.returnValue('');

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page.npcOrGoObjectives.innerText).toContain('Riverpaw Gnoll');

    fixture.debugElement.nativeElement.remove();
  });

  it('should show itemObjectives', async () => {
    const { fixture, page, service, mysqlQueryService } = setup();
    const getObjItemCountSpy: Spy = spyOn(service, 'getObjItemCount').and.returnValue('(2)');
    const questTemplate = createMockObject({ ReqItemId1: 1 }, QuestTemplate0);
    spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
    spyOn(mysqlQueryService, 'getItemNameById').and.returnValue(Promise.resolve('Mock Item'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page.itemObjectives.innerText).toContain('Mock Item (2)');

    getObjItemCountSpy.and.returnValue('');

    fixture.detectChanges();
    expect(page.itemObjectives.innerText).toContain('Mock Item');

    fixture.debugElement.nativeElement.remove();
  });

  it('should show RequiredFaction', async () => {
    const { fixture, page, service, sqliteQueryService } = setup();
    const questTemplate = createMockObject({ RepObjectiveFaction: 1, RepObjectiveValue: 900 }, QuestTemplate0);
    spyOn(service, 'getFactionByValue').and.returnValue('(Neutral)');
    spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
    spyOn(sqliteQueryService, 'getFactionNameById').and.returnValue(Promise.resolve('Mock Faction'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(page.RequiredFaction.innerText).toContain('Mock Faction (Neutral)');

    fixture.debugElement.nativeElement.remove();
  });

  describe('description/progress/completion', () => {
    it('should contain the correct text', () => {
      const { fixture, service, page } = setup();
      const description = 'My description text';
      const progress = 'My progress text';
      const completion = 'My completion text';

      const questTemplate = createMockObject({ Details: description }, QuestTemplate0);
      const questRequestItems = createMockObject({ CompletionText: progress }, QuestRequestItems);
      const questOfferReward = createMockObject({ RewardText: completion }, QuestOfferReward);

      spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
      spyOnProperty(service, 'questRequestItems', 'get').and.returnValue(questRequestItems);
      spyOnProperty(service, 'questOfferReward', 'get').and.returnValue(questOfferReward);

      fixture.detectChanges();

      expect(page.descriptionText.innerText).toContain(description);
      expect(page.progressText.innerText).toContain(progress);
      expect(page.completionText.innerText).toContain(completion);
      page.removeElement();
    });

    it('should correctly toggle', () => {
      const { fixture, page } = setup();

      fixture.detectChanges();

      page.expectCollapsed(page.descriptionToggle);
      page.expectCollapsed(page.progressToggle);
      page.expectCollapsed(page.completionToggle);

      page.clickElement(page.descriptionToggle);
      page.expectNotCollapsed(page.descriptionToggle);

      page.clickElement(page.progressToggle);
      page.expectNotCollapsed(page.progressToggle);

      page.clickElement(page.completionToggle);
      page.expectNotCollapsed(page.completionToggle);

      page.removeElement();
    });

    it('should correctly show the required money', () => {
      const { fixture, service, page } = setup();
      const spy = spyOnProperty(service, 'rewardMoney', 'get');
      spy.and.returnValue(0);
      fixture.detectChanges();

      expect(page.requiredMoney).toBe(null);
      expect(page.rewardMoney).toBe(null);

      spy.and.returnValue(-123456);
      fixture.detectChanges();

      expect(page.requiredMoney).toBeDefined();
      expect(page.rewardMoney).toBe(null);
      expect(page.requiredMoney.innerHTML).toContain('<span class="moneygold">12</span>');
      expect(page.requiredMoney.innerHTML).toContain('<span class="moneysilver">34</span>');
      expect(page.requiredMoney.innerHTML).toContain('<span class="moneycopper">56</span>');

      page.removeElement();
    });

    it('should correctly show the reward money', () => {
      const { fixture, service, page } = setup();
      const spy = spyOnProperty(service, 'rewardMoney', 'get');
      spy.and.returnValue(0);
      fixture.detectChanges();

      expect(page.rewardMoney).toBe(null);
      expect(page.requiredMoney).toBe(null);

      spy.and.returnValue(123456);
      fixture.detectChanges();

      expect(page.rewardMoney).toBeDefined();
      expect(page.requiredMoney).toBe(null);
      expect(page.rewardMoney.innerHTML).toContain('<span class="moneygold">12</span>');
      expect(page.rewardMoney.innerHTML).toContain('<span class="moneysilver">34</span>');
      expect(page.rewardMoney.innerHTML).toContain('<span class="moneycopper">56</span>');

      page.removeElement();
    });

    it('should correctly show the reward money', () => {
      const { fixture, service, page } = setup();
      const spy = spyOnProperty(service, 'RewMoneyMaxLevel', 'get');
      spy.and.returnValue(0);
      fixture.detectChanges();

      expect(page.RewMoneyMaxLevel).toBe(null);

      spy.and.returnValue(123456);
      fixture.detectChanges();

      expect(page.RewMoneyMaxLevel).toBeDefined();
      expect(page.RewMoneyMaxLevel.innerHTML).toContain('<span class="moneygold">12</span>');
      expect(page.RewMoneyMaxLevel.innerHTML).toContain('<span class="moneysilver">34</span>');
      expect(page.RewMoneyMaxLevel.innerHTML).toContain('<span class="moneycopper">56</span>');

      page.removeElement();
    });

    it('should correctly show the reward spell', async () => {
      const { fixture, service, page, sqliteQueryService } = setup();
      const RewSpellSpy = spyOn(service, 'RewSpell');
      const questTemplate = createMockObject({ RewSpell: 123 }, QuestTemplate0);
      spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
      spyOn(sqliteQueryService, 'getSpellNameById').and.returnValue(Promise.resolve('Mock Spell'));

      RewSpellSpy.and.returnValue(null);
      fixture.detectChanges();

      expect(page.RewSpell).toBeNull();

      RewSpellSpy.and.returnValue(123);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(page.RewSpell).toBeDefined();
      expect(page.RewSpell.innerText).toContain('You will learn:');
      expect(page.RewSpell.innerText).toContain('Mock Spell');

      page.removeElement();
    });

    it('should correctly show the reward items', async () => {
      const { fixture, service, page, mysqlQueryService } = setup();
      const isRewItemIdsSpy = spyOn(service, 'isRewItemIds');
      const questTemplate = createMockObject({ RewItemId1: 123, RewItemCount1: 1 }, QuestTemplate0);
      spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
      spyOn(mysqlQueryService, 'getItemNameById').and.returnValue(Promise.resolve('Mock Item'));

      isRewItemIdsSpy.and.returnValue(false);
      fixture.detectChanges();

      expect(page.RewItemIds).toBe(null);

      isRewItemIdsSpy.and.returnValue(true);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(page.RewItemIds).toBeDefined();
      expect(page.RewItemIds.innerText).toContain('You will receive:');
      expect(page.RewItemIds.innerText).toContain('Mock Item');

      page.removeElement();
    });

    it('should correctly show the reward choice items', async () => {
      const { fixture, service, page, mysqlQueryService } = setup();
      const isRewardChoiceItemsSpy = spyOn(service, 'isRewardChoiceItems');
      const questTemplate = createMockObject({ RewChoiceItemId1: 123, RewChoiceItemCount1: 1 }, QuestTemplate0);
      spyOnProperty(service, 'questTemplate', 'get').and.returnValue(questTemplate);
      spyOn(mysqlQueryService, 'getItemNameById').and.returnValue(Promise.resolve('Mock Item'));

      isRewardChoiceItemsSpy.and.returnValue(false);
      fixture.detectChanges();

      expect(page.rewardChoiceItems).toBe(null);

      isRewardChoiceItemsSpy.and.returnValue(true);

      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(page.rewardChoiceItems).toBeDefined();
      expect(page.rewardChoiceItems.innerText).toContain('You will be able to choose one of these rewards');
      expect(page.rewardChoiceItems.innerText).toContain('Mock Item');

      page.removeElement();
    });
  });
});

import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';

import { QuestTemplateComponent } from './quest-template.component';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { EditorPageObject } from '@keira-testing/editor-page-object';
import { QuestTemplate0 } from '@keira-types/quest-template.type';
import { QuestHandlerService } from '../quest-handler.service';
import { QuestModule } from '../quest.module';
import { QuestPreviewService } from '../quest-preview/quest-preview.service';

class QuestTemplatePage extends EditorPageObject<QuestTemplateComponent> {
  get questPreviewTitle() {
    return this.query(`${this.PREVIEW_CONTAINER_SELECTOR} #title`);
  }
}

describe('QuestTemplate0 integration tests', () => {
  const entry = 1234;
  const expectedFullCreateQuery =
    'DELETE FROM `quest_template` WHERE (`entry` = 1234);\n' + 'INSERT INTO `quest_template` (`entry`, `Type`) VALUES\n' + '(1234, 0);';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ToastrModule.forRoot(), ModalModule.forRoot(), RouterTestingModule, QuestModule],
      }).compileComponents();
    }),
  );

  function setup(creatingNew: boolean) {
    const originalEntity = new QuestTemplate0();
    originalEntity.ID = entry;

    const handlerService = TestBed.inject(QuestHandlerService);
    handlerService['_selected'] = `${entry}`;
    handlerService.isNew = creatingNew;

    const queryService = TestBed.inject(MysqlQueryService);
    const querySpy = spyOn(queryService, 'query').and.returnValue(of());
    spyOn(queryService, 'queryValue').and.returnValue(of());

    spyOn(queryService, 'selectAll').and.returnValue(of(creatingNew ? [] : [originalEntity]));
    // by default the other editor services should not be initialised, because the selectAll would return the wrong types for them
    const initializeServicesSpy = spyOn(TestBed.inject(QuestPreviewService), 'initializeServices');
    if (creatingNew) {
      // when creatingNew, the selectAll will return an empty array, so it's fine
      initializeServicesSpy.and.callThrough();
    }

    const fixture = TestBed.createComponent(QuestTemplateComponent);
    const component = fixture.componentInstance;
    const page = new QuestTemplatePage(fixture);
    fixture.autoDetectChanges(true);
    fixture.detectChanges();

    return { originalEntity, handlerService, queryService, querySpy, initializeServicesSpy, fixture, component, page };
  }

  describe('Creating new', () => {
    it('should correctly initialise', () => {
      const { page } = setup(true);
      page.expectQuerySwitchToBeHidden();
      page.expectFullQueryToBeShown();
      page.expectFullQueryToContain(expectedFullCreateQuery);
      page.removeElement();
    });

    it('should correctly update the unsaved status', () => {
      const { page, handlerService } = setup(true);
      const field = 'QuestInfoID';
      expect(handlerService.isQuestTemplateUnsaved).toBe(false);
      page.setInputValueById(field, 81);
      expect(handlerService.isQuestTemplateUnsaved).toBe(true);
      page.setInputValueById(field, 0);
      expect(handlerService.isQuestTemplateUnsaved).toBe(false);
      page.removeElement();
    });

    it('changing a property and executing the query should correctly work', () => {
      const { page, querySpy } = setup(true);
      querySpy.calls.reset();

      page.setInputValueById('Title', 'Shin');
      page.clickExecuteQuery();

      // Note: full query check has been shortened here because the table is too big, don't do this in other tests unless necessary
      page.expectFullQueryToContain('Shin');
      expect(querySpy).toHaveBeenCalledTimes(1);
      expect(querySpy.calls.mostRecent().args[0]).toContain('Shin');
      page.removeElement();
    });

    it('changing a property should be reflected in the quest preview', () => {
      const { page } = setup(true);
      const value = 'Fix all AzerothCore bugs';

      page.setInputValueById('Title', value);

      expect(page.questPreviewTitle.innerText).toContain(value);
      page.removeElement();
    });
  });

  describe('Editing existing', () => {
    it('should correctly initialise', () => {
      const { page } = setup(false);
      page.expectDiffQueryToBeShown();
      page.expectDiffQueryToBeEmpty();
      page.expectFullQueryToContain(expectedFullCreateQuery);
      page.removeElement();
    });

    it('changing all properties and executing the query should correctly work', () => {
      const { page, querySpy, originalEntity } = setup(false);
      const expectedQuery = 'UPDATE `quest_template` SET `QuestLevel` = 1, WHERE (`entry` = 1234);';
      querySpy.calls.reset();

      page.changeAllFields(originalEntity, ['VerifiedBuild']);
      page.clickExecuteQuery();

      page.expectDiffQueryToContain(expectedQuery);
      expect(querySpy).toHaveBeenCalledTimes(6);
      expect(querySpy.calls.mostRecent().args[0]).toContain(expectedQuery);
      page.removeElement();
    });

    it('changing values should correctly update the queries', () => {
      const { page } = setup(false);
      // Note: full query check has been shortened here because the table is too big, don't do this in other tests unless necessary

      page.setInputValueById('Title', 'Shin');
      page.expectDiffQueryToContain("UPDATE `quest_template` SET `Title` = 'Shin' WHERE (`entry` = 1234);");
      page.expectFullQueryToContain('Shin');

      page.setInputValueById('MinLevel', 22);
      page.expectDiffQueryToContain("UPDATE `quest_template` SET `MinLevel` = 22, `Title` = 'Shin' WHERE (`entry` = 1234);");
      page.expectFullQueryToContain('Shin');
      page.expectFullQueryToContain('22');
      page.removeElement();
    });

    it(
      'changing a value via FlagsSelector should correctly work',
      waitForAsync(async () => {
        const { page } = setup(false);
        const field = 'Flags';
        page.clickElement(page.getSelectorBtn(field));
        await page.whenReady();
        page.expectModalDisplayed();

        page.toggleFlagInRowExternal(2);
        await page.whenReady();
        page.toggleFlagInRowExternal(12);
        await page.whenReady();
        page.clickModalSelect();
        await page.whenReady();

        expect(page.getInputById(field).value).toEqual('4100');
        page.expectDiffQueryToContain('UPDATE `quest_template` SET `Flags` = 4100 WHERE (`entry` = 1234);');

        // Note: full query check has been shortened here because the table is too big, don't do this in other tests unless necessary
        page.expectFullQueryToContain('4100');
        page.removeElement();
      }),
    );
  });
});

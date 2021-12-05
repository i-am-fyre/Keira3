import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HandlerService } from '@keira-abstract/service/handlers/handler.service';
import { QUEST_TEMPLATE_TABLE, QuestTemplate0 } from '@keira-types/quest-template.type';

@Injectable()
export class QuestHandlerService extends HandlerService<QuestTemplate0> {
  get isQuestTemplateUnsaved(): boolean {
    return this.statusMap[QUEST_TEMPLATE_TABLE];
  }

  protected _statusMap = {
    [QUEST_TEMPLATE_TABLE]: false,
  };

  /* istanbul ignore next */ // because of: https://github.com/gotwarlost/istanbul/issues/690
  constructor(protected router: Router) {
    super('quest/quest-template', router);
  }
}

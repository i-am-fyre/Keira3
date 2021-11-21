import { Injectable } from '@angular/core';

import { SelectService } from '@keira-abstract/service/select/select.service';
import {
  QUEST_TEMPLATE_ENTRY,
  QUEST_TEMPLATE_NAME,
  QUEST_TEMPLATE_SEARCH_FIELDS,
  QUEST_TEMPLATE_TABLE,
  QuestTemplate0,
} from '@keira-types/quest-template.type';
import { MysqlQueryService } from '@keira-shared/services/mysql-query.service';
import { QuestHandlerService } from '../quest-handler.service';

@Injectable()
export class SelectQuestService extends SelectService<QuestTemplate0> {
  /* istanbul ignore next */ // because of: https://github.com/gotwarlost/istanbul/issues/690
  constructor(public readonly queryService: MysqlQueryService, public handlerService: QuestHandlerService) {
    super(queryService, handlerService, QUEST_TEMPLATE_TABLE, QUEST_TEMPLATE_ENTRY, QUEST_TEMPLATE_NAME, QUEST_TEMPLATE_SEARCH_FIELDS);
  }
}

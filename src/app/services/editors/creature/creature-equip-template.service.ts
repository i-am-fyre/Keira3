import { Injectable } from '@angular/core';

import { SingleRowEditorService } from '../single-row-editor.service';
import { CreatureHandlerService } from '../../handlers/creature-handler.service';
import { QueryService } from '../../query.service';
import {
  CREATURE_EQUIP_TEMPLATE_ID, CREATURE_EQUIP_TEMPLATE_TABLE,
  CreatureEquipTemplate
} from '../../../components/editors/creature/creature-equip-template/creature-equip-template.type';

@Injectable({
  providedIn: 'root'
})
export class CreatureEquipTemplateService extends SingleRowEditorService<CreatureEquipTemplate> {

  constructor(
    protected handlerService: CreatureHandlerService,
    protected queryService: QueryService,
  ) {
    super(
      CreatureEquipTemplate,
      CREATURE_EQUIP_TEMPLATE_TABLE,
      CREATURE_EQUIP_TEMPLATE_ID,
      null,
      false,
      handlerService,
      queryService,
    );
  }
}

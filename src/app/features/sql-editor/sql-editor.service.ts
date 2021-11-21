import { Injectable } from '@angular/core';

@Injectable()
export class SqlEditorService {
  code = 'SELECT `entry`, `Title` \n' + 'FROM `quest_template` \n' + 'WHERE `entry` < 100 \n' + 'ORDER BY `entry` ASC \n' + 'LIMIT 100';
}

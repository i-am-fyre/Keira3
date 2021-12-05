import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from '../features/dashboard/dashboard.component';

import { QuestTemplateComponent } from '../features/quest/quest-template/quest-template.component';
import { QuestHandlerService } from '../features/quest/quest-handler.service';
import { SelectQuestComponent } from '../features/quest/select-quest/select-quest.component';
import { SqlEditorComponent } from '../features/sql-editor/sql-editor.component';
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'sql-editor',
    component: SqlEditorComponent,
  },
  {
    path: 'quest',
    children: [
      {
        path: 'select',
        component: SelectQuestComponent,
      },
      {
        path: 'quest-template',
        component: QuestTemplateComponent,
        canActivate: [QuestHandlerService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

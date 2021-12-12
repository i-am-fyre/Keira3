import { NgModule } from '@angular/core';

import { SelectQuestModule } from './select-quest/select-quest.module';
import { QuestHandlerService } from './quest-handler.service';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { TopBarModule } from '@keira-shared/modules/top-bar/top-bar.module';
import { QueryOutputModule } from '@keira-shared/modules/query-output/query-output.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToastrModule } from 'ngx-toastr';
import { toastrConfig } from '@keira-config/toastr.config';
import { EditorButtonsModule } from '@keira-shared/modules/editor-buttons/editor-buttons.module';
import { FlagsSelectorModule } from '@keira-shared/modules/selectors/flags-selector/flags-selector.module';
import { QuestPreviewComponent } from './quest-preview/quest-preview.component';
import { QuestPreviewService } from './quest-preview/quest-preview.service';
import { QuestTemplateComponent } from './quest-template/quest-template.component';
import { QuestTemplateService } from './quest-template/quest-template.service';
import { QuestSelectorModule } from '@keira-shared/modules/selectors/quest-selector/quest-selector.module';
import { IconModule } from '@keira-shared/modules/icon/icon.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const components = [QuestTemplateComponent, QuestPreviewComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    SelectQuestModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    TopBarModule,
    QueryOutputModule,
    NgxDatatableModule,
    TooltipModule,
    ToastrModule,
    EditorButtonsModule,
    FlagsSelectorModule,
    QuestSelectorModule,
    IconModule,
    PerfectScrollbarModule,
    CollapseModule,
  ],
  providers: [QuestHandlerService, QuestPreviewService, QuestTemplateService],
})
export class QuestModule {}

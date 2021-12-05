import 'reflect-metadata';
import '../polyfills';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { UiSwitchModule } from 'ngx-ui-switch';
import { uiSwitchConfig } from '@keira-config/ui-switch.config';
import { toastrConfig } from '@keira-config/toastr.config';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { highlightOptions } from '@keira-config/highlight.config';

import { AppRoutingModule } from './config/app-routing.module';
import { AppComponent } from './main/app.component';
import { ConnectionWindowModule } from './main/connection-window/connection-window.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { MainWindowModule } from './main/main-window/main-window.module';
import { QuestModule } from './features/quest/quest.module';
import { SqlEditorModule } from './features/sql-editor/sql-editor.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    /* Libraries */
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ToastrModule.forRoot(toastrConfig),
    UiSwitchModule.forRoot(uiSwitchConfig),
    /* Misc */
    AppRoutingModule,
    ConnectionWindowModule,
    DashboardModule,
    MainWindowModule,
    /* Editors */
    SqlEditorModule,
    QuestModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: highlightOptions,
    },
  ],
})
export class AppModule {}

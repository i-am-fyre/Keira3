import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SidebarService } from './sidebar.service';

import { MysqlService } from '@keira-shared/services/mysql.service';
import { QuestHandlerService } from '../../../features/quest/quest-handler.service';
import { LocationService } from '@keira-shared/services/location.service';

const animationTime = 200;

@Component({
  selector: 'keira-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slide', [
      state('up', style({ height: 0 })),
      state('down', style({ height: '*' })),
      transition('up <=> down', animate(animationTime)),
    ]),
  ],
})
export class SidebarComponent {
  menuStates: { [key: string]: 'down' | 'up' } = {
    creature: 'up',
    quest: 'up',
    gameobject: 'up',
    item: 'up',
    otherLoot: 'up',
    smartAi: 'up',
    conditions: 'up',
    gossip: 'up',
    spell: 'up',
  };
  private readonly IMAGES_COUNT = 7;
  private readonly RANDOM_IMAGE = Math.floor(Math.random() * this.IMAGES_COUNT) + 1;
  readonly style = `background-image: url(assets/img/sidebar-backgrounds/bg${this.RANDOM_IMAGE}.jpg);`;

  constructor(
    public sidebarService: SidebarService,
    public mysqlService: MysqlService,
    public questHandlerService: QuestHandlerService,
    private locationService: LocationService,
  ) {}

  getSideBarState() {
    return this.sidebarService.getSidebarState();
  }

  toggleSidebar() {
    this.sidebarService.setSidebarState(!this.sidebarService.getSidebarState());

    /* istanbul ignore next */
    setTimeout(() => {
      // fix ngx-datatable(s) size
      window.dispatchEvent(new Event('resize'));
    }, animationTime + 100);
  }

  hasBackgroundImage() {
    return this.sidebarService.hasBackgroundImage;
  }

  toggleState(key: string) {
    this.menuStates[key] = this.menuStates[key] === 'up' ? 'down' : 'up';
  }

  collapseAll() {
    for (const key in this.menuStates) {
      /* istanbul ignore else */
      if (this.menuStates.hasOwnProperty(key)) {
        this.menuStates[key] = 'up';
      }
    }
  }

  logout() {
    this.locationService.reload();
  }
}

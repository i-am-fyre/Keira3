import { Injectable } from '@angular/core';
import { RACE, CLASSES, RACES_TEXT } from '@keira-shared/constants/preview';
import { core } from 'app/features/dashboard/dashboard.component';

@Injectable({ providedIn: 'root' })
export class PreviewHelperService {
  public formatMoney(qty: number): string {
    let money = '';

    if (qty >= 10000) {
      const g = Math.floor(qty / 10000);
      money += `<span class="moneygold">${g}</span> &nbsp;`;
      qty -= g * 10000;
    }

    if (qty >= 100) {
      const s = Math.floor(qty / 100);
      money += `<span class="moneysilver">${s}</span> &nbsp;`;
      qty -= s * 100;
    }

    money += `<span class="moneycopper">${qty}</span> &nbsp;`;

    return money;
  }

  public getFactionFromRace(raceMask: number): string {
    let horde = 0x000;
    let alliance = 0x000;    

    switch (core) {
      case 0:
        horde = RACE.MASK_HORDE_0;
        alliance = RACE.MASK_ALLIANCE_0;
        break;
      case 1:
      case 2:
        horde = RACE.MASK_HORDE_1_2;
        alliance = RACE.MASK_ALLIANCE_1_2;
        break;
      case 3:
        horde = RACE.MASK_HORDE_3;
        alliance = RACE.MASK_ALLIANCE_3;
        break;
    }

    if (raceMask === horde) {
      return RACES_TEXT['-2'];
    }

    if (raceMask === alliance) {
      return RACES_TEXT['-1'];
    }

    return null;
  }

  public getRaceString(raceMask: number): any[] {
    let all = 0x000;

    switch (core) {
      case 0:
        all = RACE.MASK_ALL_0;
        break;
      case 1:
      case 2:
        all = RACE.MASK_ALL_1_2;
        break;
      case 3:
        all = RACE.MASK_ALL_3;
        break;
    }

    // clamp to available races
    raceMask &= all;
    // available to all races (we don't display 'both factions')
    if (!raceMask || raceMask === all) {
      return null;
    }

    const faction = this.getFactionFromRace(raceMask);

    if (!!faction) {
      return [faction];
    }

    const tmp = [];
    let i = 1;
    while (raceMask) {
      if (raceMask & (1 << (i - 1))) {
        /* istanbul ignore else */
        if (!!i) {
          tmp.push(i);
        }
        raceMask &= ~(1 << (i - 1));
      }
      i++;
    }

    return tmp;
  }

  public getRequiredClass(classMask: number): number[] {
    classMask &= CLASSES.MASK_ALL; // clamp to available classes..

    if (classMask === CLASSES.MASK_ALL) {
      // available to all classes
      return null;
    }

    const tmp = [];
    let i = 1;
    while (classMask) {
      if (classMask & (1 << (i - 1))) {
        /* istanbul ignore else */
        if (!!i) {
          tmp.push(i);
        }

        classMask &= ~(1 << (i - 1));
      }
      i++;
    }

    return tmp;
  }
}

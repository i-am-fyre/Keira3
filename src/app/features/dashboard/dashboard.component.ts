import { Component, OnInit } from '@angular/core';

import { MysqlQueryService } from '../../shared/services/mysql-query.service';
import { MCore, VersionRow } from '@keira-types/general';
import packageInfo from '../../../../package.json';
import { AC_FORUM_URL, PAYPAL_DONATE_URL, KEIRA3_REPO_URL, AC_DISCORD_URL } from '@keira-constants/general';
import { SubscriptionHandler } from '@keira-shared/utils/subscription-handler/subscription-handler';
import { ConfigService } from '@keira-shared/services/config.service';
import { MysqlService } from '@keira-shared/services/mysql.service';

@Component({
  selector: 'keira-home',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends SubscriptionHandler implements OnInit {
  databaseCore: MCore;
  databaseVersions: VersionRow;
  core: number;
  error = false;
  public readonly KEIRA_VERSION = packageInfo.version;
  public readonly PAYPAL_DONATE_URL = PAYPAL_DONATE_URL;
  public readonly AC_FORUM_URL = AC_FORUM_URL;
  public readonly AC_DISCORD_URL = AC_DISCORD_URL;
  public readonly KEIRA3_REPO_URL = KEIRA3_REPO_URL;
  public readonly NAVIGATOR_APP_VERSION = window.navigator.appVersion;

  get databaseName() {
    return this.mysqlService.config.database;
  }

  get databaseCoreVersion() {
    return this.core;
  }

  constructor(private queryService: MysqlQueryService, public configService: ConfigService, private readonly mysqlService: MysqlService) {
    super();
  }

  ngOnInit() {
    this.getDatabaseCoreVersion();
    this.getDatabaseVersion();
  }

  /*
      To determine which MaNGOS core is being used. This will affect how tables are utilized when it comes down to differences in cores.
  */
  private async getDatabaseCoreVersion() {
    const coreTables = ["phase_definitions", "dungeonfinder_item_rewards", "mail_level_reward"]; // M3, M2, M1, if none of the above --> M0
    var counter = 3; // M3 being the most supported database.
    
    for (let t = 0; t < coreTables.length; t++) {
      this.core = counter;
      const query = `SELECT T.TABLE_NAME AS TableName FROM INFORMATION_SCHEMA.Tables T  WHERE T.TABLE_NAME <> 'dtproperties' AND T.TABLE_SCHEMA <> 'INFORMATION_SCHEMA' AND T.TABLE_NAME='${coreTables[t]}' AND  T.TABLE_SCHEMA='${this.databaseName}'  ORDER BY T.TABLE_NAME`;
      
      const response = await this.queryService.query<MCore>(query).toPromise();

      if (response && response.length > 0) {
        this.databaseCore = response[0];
        break;
      } else {
        counter--;
        this.core = counter;
        continue;
      }
      
    }
  }



  private getDatabaseVersion(): void {
    const query = 'SELECT version,structure,content FROM db_version ORDER BY VERSION DESC, structure DESC, content DESC LIMIT 0,1';

    this.subscriptions.push(
      this.queryService.query<VersionRow>(query).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.databaseVersions = data[0];
          } else {
            console.error(`Query ${query} produced no results: ${data}`);
          }
        },
        (error) => {
          this.error = true;
          console.error(error);
        },
      ),
    );
  }
}

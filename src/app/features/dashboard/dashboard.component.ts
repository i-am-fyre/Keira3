import { Component, OnInit } from '@angular/core';

import { MysqlQueryService } from '../../shared/services/mysql-query.service';
import { VersionRow } from '@keira-types/general';
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
  databaseVersions: VersionRow;
  dbWorldVersion: string;
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

  constructor(private queryService: MysqlQueryService, public configService: ConfigService, private readonly mysqlService: MysqlService) {
    super();
  }

  ngOnInit() {
    this.getDatabaseVersion();
  }

  private getDatabaseVersion(): void {
    const query = 'SELECT version,structure,content FROM db_version ORDER BY VERSION DESC, structure DESC, content DESC LIMIT 0,1';

    this.subscriptions.push(
      this.queryService.query<VersionRow>(query).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.databaseVersions = data[0];

            // if (!this.databaseVersions.db_version.startsWith('ACDB') || !this.databaseVersions.core_version.startsWith('AzerothCore')) {
            //   this.error = true;
            // }
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

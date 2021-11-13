import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { anyString, instance, when } from 'ts-mockito';
import { of, throwError } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { MysqlQueryService } from '../../shared/services/mysql-query.service';
import { MockedMysqlQueryService } from '@keira-testing/mocks';
import { MCore, VersionRow } from '@keira-types/general';
import { PageObject } from '@keira-testing/page-object';
import { DashboardModule } from './dashboard.module';
import { MysqlService } from '@keira-shared/services/mysql.service';

class DashboardComponentPage extends PageObject<DashboardComponent> {
  get databaseCore() {
    return this.query<HTMLTableCellElement>('#database-core');
  }
  get databaseVersion() {
    return this.query<HTMLTableCellElement>('#database-version');
  }
  get databaseStructure() {
    return this.query<HTMLTableCellElement>('#database-structure');
  }
  get databaseContent() {
    return this.query<HTMLTableCellElement>('#database-content');
  }
  get dbWarning() {
    return this.query<HTMLDivElement>('#database-warning', false);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let page: DashboardComponentPage;

  const versionCore: MCore = {
    core: 'MaNGOS x',
  };

  const versionRow: VersionRow = {
    database_version: '0',
    database_structure: '0',
    database_content: '0',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DashboardModule],
        providers: [{ provide: MysqlQueryService, useValue: instance(MockedMysqlQueryService) }],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    when(MockedMysqlQueryService.query('SELECT * FROM db_version')).thenReturn(of([versionRow]));
    const mysqlService = TestBed.inject(MysqlService);
    mysqlService['_config'] = { database: 'my_db' };

    fixture = TestBed.createComponent(DashboardComponent);
    page = new DashboardComponentPage(fixture);
    component = fixture.componentInstance;
  });

  it('should correctly display the versions', () => {
    fixture.detectChanges();

    expect(page.databaseVersion.innerHTML).toContain(versionRow.database_version);
    expect(page.databaseStructure.innerHTML).toContain(versionRow.database_structure);
    expect(page.databaseContent.innerHTML).toContain(versionRow.database_content);
    expect(page.dbWarning).toBe(null);
    expect(component.error).toBe(false);
  });

  it('should correctly give error if the query does not return the data in the expected format', () => {
    when(MockedMysqlQueryService.query(anyString())).thenReturn(of([]));
    const errorSpy = spyOn(console, 'error');

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(page.dbWarning).toBe(null);
    expect(component.error).toBe(false);
  });

  it('should correctly give error if the query returns an error', () => {
    const error = 'some error';
    when(MockedMysqlQueryService.query(anyString())).thenReturn(throwError(error));
    const errorSpy = spyOn(console, 'error');

    fixture.detectChanges();

    expect(errorSpy).toHaveBeenCalledTimes(2);
    expect(errorSpy).toHaveBeenCalledWith(error);
    expect(page.dbWarning).toBeDefined();
    expect(component.error).toBe(true);
  });

  it('should correctly give error if the query returns an error', () => {
    const wrongVersionRow: VersionRow = {
      database_version: 'version error',
      database_structure: 'structure error',
      database_content: 'content error',
    };
    when(MockedMysqlQueryService.query(anyString())).thenReturn(of([wrongVersionRow]));

    fixture.detectChanges();

    expect(page.dbWarning).toBeDefined();
    expect(component.error).toBe(true);
  });
});

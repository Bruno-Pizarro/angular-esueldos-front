import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { map, startWith, switchMap } from 'rxjs';
import { IUser } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
import { UserModalComponent } from 'src/app/modules/user/components/user-modal/user-modal.component';
import { UsersService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialModule,
    UserModalComponent,
  ],
  selector: 'app-user-list',
  standalone: true,
  styleUrls: ['./user-list.component.scss'],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements AfterViewInit {
  totalData: number = 0;
  displayedColumns: (keyof IUser | string)[] = [
    'id',
    'name',
    'email',
    'isEmailVerified',
    'role',
    'menu',
  ];
  dataSource = new MatTableDataSource<IUser>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private userService: UsersService,
    public auth: AuthService
  ) {
    this.getUsersData();
  }

  usersData: IUser[] = [];

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sort: Sort) => {
      this.paginator.pageIndex = 0;
      this.getUsersData();
      this.announceSortChange(sort);
    });

    this.userService.usersUpdated$.subscribe(() => {
      this.paginator.page
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.getUsersData();
          }),
          map((response) => {
            if (response == null) return [];
            this.totalData = response.totalPages * response.results.length;
            return response.results;
          })
        )
        .subscribe((usersData) => {
          this.usersData = usersData;
          this.dataSource = new MatTableDataSource(this.usersData);
          this.dataSource.sort = this.sort;
        });
    });
  }

  async getUsersData() {
    const sortField = this.sort?.active || '';
    const sortDirection = this.sort?.direction || 'asc';
    const users = await this.userService.getUsers(
      this.paginator.pageIndex + 1,
      sortField ? `${sortField}:${sortDirection}` : undefined
    );
    return users;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

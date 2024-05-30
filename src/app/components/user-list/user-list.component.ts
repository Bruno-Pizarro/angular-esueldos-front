import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { IUser } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
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
  user!: IUser;
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
    this.loadUsers();
  }

  async ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(await this.userService.getUsers());
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;
    this.user = this.auth.currentUser!;

    this.userService.usersUpdated$.subscribe(() => {
      this.loadUsers();
    });
  }

  async loadUsers() {
    const users = await this.userService.getUsers();
    this.dataSource.data = users;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

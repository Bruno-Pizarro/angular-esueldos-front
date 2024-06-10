import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material';
import { UserComponent } from './user.component';
import {
  EditUserDialog,
  DeleteUserDialog,
  CreateUserDialog,
  UserListComponent,
  UserModalComponent,
} from './components';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    UserComponent,
    EditUserDialog,
    DeleteUserDialog,
    CreateUserDialog,
  ],
  imports: [
    CommonModule,
    UserListComponent,
    UserModalComponent,
    MaterialModule,
    ReactiveFormsModule,
    UserRoutingModule,
  ],
})
export class UserModule {}

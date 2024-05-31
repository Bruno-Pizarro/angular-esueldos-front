import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToolbarComponent, UserListComponent } from 'src/app/components';
import {
  DeleteUserDialog,
  EditUserDialog,
} from 'src/app/components/user-modal/components';
import { CreateUserDialog } from 'src/app/components/user-modal/components/create';
import { UserModalComponent } from 'src/app/components/user-modal/user-modal.component';
import { MaterialModule } from 'src/app/modules/material';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [
    HomeComponent,
    EditUserDialog,
    DeleteUserDialog,
    CreateUserDialog,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    UserListComponent,
    ToolbarComponent,
    UserModalComponent,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}

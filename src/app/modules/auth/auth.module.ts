import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from 'src/app/modules/auth';
import {
  LoginComponent,
  RegisterComponent,
  UnauthorizedComponent,
} from 'src/app/modules/auth/components';
import { MaterialModule } from 'src/app/modules/material';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, UnauthorizedComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
  ],
  providers: [],
})
export class AuthModule {}

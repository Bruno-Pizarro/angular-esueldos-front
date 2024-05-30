import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from 'src/app/modules/auth';
import {
  LoginComponent,
  RegisterComponent,
} from 'src/app/modules/auth/components';
import { MaterialModule } from 'src/app/modules/material';

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [],
})
export class AuthModule {}

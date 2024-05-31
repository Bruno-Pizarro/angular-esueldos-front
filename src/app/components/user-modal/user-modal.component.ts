import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateUserDialog,
  DeleteUserDialog,
  EditUserDialog,
} from 'src/app/components/user-modal/components';
import { IUser } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  standalone: true,
  styleUrls: ['./user-modal.component.scss'],
  imports: [CommonModule, MaterialModule],
})
export class UserModalComponent {
  @Input() userSelected!: IUser;
  @Input() type!: 'edit' | 'delete' | 'create';
  dialogDictionary: { [key in typeof this.type]: any } = {
    create: CreateUserDialog,
    delete: DeleteUserDialog,
    edit: EditUserDialog,
  };

  constructor(public dialog: MatDialog) {}

  onClick() {
    this.dialog.open(this.dialogDictionary[this.type], {
      data: this?.userSelected?.id ?? null,
    });
  }

  editUser(): void {
    this.dialog.open(EditUserDialog, {
      data: this.userSelected.id,
    });
  }

  deleteUser(): void {
    this.dialog.open(DeleteUserDialog, {
      data: this.userSelected.id,
    });
  }

  createUser(): void {
    this.dialog.open(CreateUserDialog);
  }
}

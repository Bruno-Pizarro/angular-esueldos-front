import { Component, EventEmitter, inject, Inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { ProductsService, ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'edit-stock-dialog',
  templateUrl: './edit-stock-dialog.component.html',
})
export class EditStockDialog {
  fb = inject(NonNullableFormBuilder);

  constructor(
    public authService: AuthService,
    private productService: ProductsService,
    public validationService: ValidationService,
    public dialogRef: MatDialogRef<EditStockDialog>,
    @Inject(MAT_DIALOG_DATA)
    public selected: {
      selectedProducts: IProduct[];
      resetProducts: EventEmitter<any>;
    }
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  async editStock() {
    if (this.form.valid && this.form.value) {
      await this.productService
        .updateStock(
          this.selected.selectedProducts.map((p) => ({
            productId: p.id,
            quantity: this.form.value.quantity!,
          }))
        )
        .then(() => {
          this.form.reset();
          this.selected.resetProducts.emit();
          this.closeModal();
        });
    }
  }

  //capip
  form = this.fb.group({
    quantity: this.fb.control(0, {
      validators: [Validators.required, Validators.min(0)],
    }),
  });
}

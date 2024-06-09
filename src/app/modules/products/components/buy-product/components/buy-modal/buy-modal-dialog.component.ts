import { Component, inject, Inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { ProductsService, ValidationService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'buy-modal-dialog',
  templateUrl: './buy-modal-dialog.component.html',
})
export class BuyProductDialog {
  fb = inject(NonNullableFormBuilder);

  constructor(
    public authService: AuthService,
    private productService: ProductsService,
    public validationService: ValidationService,
    public dialogRef: MatDialogRef<BuyProductDialog>,
    @Inject(MAT_DIALOG_DATA)
    public selected: IProduct
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  async buyProduct() {
    if (this.form.valid && this.form.value) {
      await this.productService
        .buyProduct({
          productId: this.selected.id,
          quantity: this.form.value.quantity!,
        })
        .then(() => {
          this.form.reset();
          this.closeModal();
        });
    }
  }

  //capip
  form = this.fb.group({
    quantity: this.fb.control(1, {
      validators: [
        Validators.required,
        Validators.min(1),
        Validators.max(this.selected.stock.quantity),
      ],
    }),
  });
}

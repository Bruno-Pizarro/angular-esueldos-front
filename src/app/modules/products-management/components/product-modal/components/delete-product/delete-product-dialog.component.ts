import { Component, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { ProductsService } from 'src/app/services';

@Component({
  selector: 'delete-product-dialog',
  templateUrl: './delete-product-dialog.component.html',
})
export class DeleteProductDialog {
  constructor(
    private productsService: ProductsService,
    public dialogRef: MatDialogRef<DeleteProductDialog>,
    @Inject(MAT_DIALOG_DATA)
    public productsParams: {
      selectedProducts: IProduct[];
      selectProduct: EventEmitter<IProduct>;
      selectedProduct: IProduct;
    }
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }

  async deleteProduct() {
    const findProduct = this.productsParams.selectedProducts.find(
      (p) => p.id === this.productsParams.selectedProduct.id
    );
    if (findProduct) this.productsParams.selectProduct.emit(findProduct);
    await this.productsService.deleteProduct(
      this.productsParams.selectedProduct.id
    );
    this.dialogRef.close(true);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
import { DeleteProductDialog } from 'src/app/modules/products-management/components/product-modal/components';

@Component({
  selector: 'product-modal',
  templateUrl: 'product-modal.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class ProductModalComponent {
  @Input() selectedProducts!: IProduct[];
  @Output() selectProduct = new EventEmitter<IProduct>();
  @Input() selectedProduct!: IProduct;

  constructor(public dialog: MatDialog) {}

  onClick() {
    this.dialog.open(DeleteProductDialog, {
      data: {
        selectedProducts: this.selectedProducts,
        selectProduct: this.selectProduct,
        selectedProduct: this.selectedProduct,
      },
    });
  }
}

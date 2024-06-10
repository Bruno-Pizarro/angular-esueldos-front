import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
import { BuyProductDialog } from 'src/app/modules/products/components/buy-product/components';

@Component({
  selector: 'buy-product',
  templateUrl: 'buy-product.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class BuyProductComponent {
  @Input() selectedProduct!: IProduct;

  constructor(public dialog: MatDialog) {}

  onClick() {
    this.dialog.open(BuyProductDialog, {
      data: {
        ...this.selectedProduct,
      },
    });
  }
}

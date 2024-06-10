import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProduct } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
import { EditStockDialog } from 'src/app/modules/products-management/components/stock-modal/components';

@Component({
  selector: 'stock-modal',
  templateUrl: 'stock-modal.component.html',
  standalone: true,
  imports: [CommonModule, MaterialModule],
})
export class StockModalComponent {
  @Input() selectedProducts!: IProduct[];
  @Output() resetProducts = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  onClick() {
    this.dialog.open(EditStockDialog, {
      data: {
        selectedProducts: this.selectedProducts,
        resetProducts: this.resetProducts,
      },
    });
  }
}

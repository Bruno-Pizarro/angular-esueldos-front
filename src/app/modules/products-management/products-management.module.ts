import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material';
import { ProductsRoutingModule } from './products-management-routing.module';
import { ProductManagementComponent } from 'src/app/modules/products-management/products-management.component';
import { ProductsListComponent } from 'src/app/modules/products-management/components/products-list';
import { ProductsFormComponent } from 'src/app/modules/products/components';
import {
  DeleteProductDialog,
  EditStockDialog,
  ProductModalComponent,
  StockModalComponent,
} from 'src/app/modules/products-management/components';
import { SearchBarComponent } from 'src/app/components/search-product';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [
    ProductManagementComponent,
    ProductsFormComponent,
    EditStockDialog,
    DeleteProductDialog,
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    StockModalComponent,
    ProductModalComponent,
    ProductsListComponent,
    SearchBarComponent,
    NgxFileDropModule,
  ],
})
export class ProductsManagementModule {}

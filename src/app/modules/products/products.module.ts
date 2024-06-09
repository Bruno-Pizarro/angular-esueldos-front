import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/modules/material';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductCardComponent } from 'src/app/modules/products/components';
import {
  BuyProductComponent,
  BuyProductDialog,
} from 'src/app/modules/products/components/buy-product';

@NgModule({
  declarations: [ProductsComponent, ProductCardComponent, BuyProductDialog],
  imports: [
    BuyProductComponent,
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
})
export class ProductsModule {}

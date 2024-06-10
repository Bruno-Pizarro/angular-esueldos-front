import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from 'src/app/modules/products-management/products-management.component';
import { ProductsFormComponent } from 'src/app/modules/products/components';

const routes: Routes = [
  { path: '', component: ProductManagementComponent },
  { path: 'create', component: ProductsFormComponent },
  { path: ':productId', component: ProductsFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}

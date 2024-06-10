import { Component } from '@angular/core';
import { IProduct } from 'src/app/models';

@Component({
  selector: 'product-management',
  templateUrl: './products-management.component.html',
})
export class ProductManagementComponent {
  searchInput: string = '';
  selectedProducts: IProduct[] = [];
  setSearch(search: string) {
    this.searchInput = search.trim();
  }

  selectProduct(product: IProduct) {
    const isProductAdded = this.selectedProducts.find(
      (p) => p.id === product.id
    );
    if (isProductAdded)
      this.selectedProducts = this.selectedProducts.filter(
        (p) => p.id !== product.id
      );
    else this.selectedProducts.push(product);
  }

  resetProducts() {
    this.selectedProducts = [];
  }

  onSelectAll(products: IProduct[]) {
    if (this.selectedProducts.length) this.resetProducts();
    else this.selectedProducts = products;
  }
}

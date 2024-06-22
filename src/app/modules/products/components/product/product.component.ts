import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'product-card',
  templateUrl: 'product.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: IProduct;
  @Input() showDescription: boolean = false;
  @Input() showBottomBar: boolean = true;
  imageUrl = '';
  hasImage: boolean = Boolean(this.product?.image);

  ngOnInit(): void {
    this.hasImage = Boolean(this.product?.image);
    this.imageUrl = `${
      environment.BASE_URL
    }/products/uploads/${this.product.image.split('/').pop()}`;
  }
}

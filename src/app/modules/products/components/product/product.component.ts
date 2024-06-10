import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from 'src/app/models';

@Component({
  selector: 'product-card',
  templateUrl: 'product.component.html',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: IProduct;
  @Input() showDescription: boolean = false;
  @Input() showBottomBar: boolean = true;
  imageRegEx =
    /(?:(?:https?:\/\/))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/=]*(\.jpg|\.png|\.jpeg))/g;
  hasImage: boolean = Boolean(
    this.product?.image && this.imageRegEx.test(this.product?.image)
  );

  ngOnInit(): void {
    this.hasImage = Boolean(
      this.product?.image && this.imageRegEx.test(this.product?.image)
    );
  }
}

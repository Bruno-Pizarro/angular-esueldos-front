import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICreateProduct,
  IEditProduct,
  IGenericHideState,
  IInputProps,
  IProduct,
} from 'src/app/models';
import { ProductsService, ValidationService } from 'src/app/services';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductsFormComponent implements OnInit {
  type: 'edit' | 'create' = 'create';
  product?: IProduct;
  id?: string | null;
  imageRegEx =
    /(?:(?:https?:\/\/))[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b(?:[-a-zA-Z0-9@:%_\+.~#?&\/=]*(\.jpg|\.png|\.jpeg))/g;

  fb = inject(NonNullableFormBuilder);
  hide!: IGenericHideState<ICreateProduct>;
  inputProps: IInputProps<ICreateProduct>[] = [];

  form = this.fb.group<{ [key in keyof ICreateProduct]: any }>({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    image: this.fb.control('', {
      validators: [Validators.required, Validators.pattern(this.imageRegEx)],
    }),
    description: this.fb.control('', {
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    price: this.fb.control(1, {
      validators: [Validators.required, Validators.min(1)],
    }),
    quantity: this.fb.control(0, {
      validators: [Validators.min(0)],
    }),
  });

  constructor(
    private router: Router,
    public productsService: ProductsService,
    public validationService: ValidationService,
    private route: ActivatedRoute
  ) {}

  //lc
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('productId');
    });
    this.loadProduct();
    this.updateInputProps();
  }

  public hideButton(input: IInputProps<ICreateProduct>) {
    this.hide[input.name] = !this.hide[input.name];
    this.updateInputProps();
  }

  async loadProduct() {
    if (this.id) {
      this.type = 'edit';
      this.product = await this.productsService.getProductByID(this.id);
      this.form.patchValue({
        description: this.product.description,
        name: this.product.name,
        image: this.product.image,
        price: this.product.price,
        quantity: this.product.stock.quantity,
      });
    }
  }

  async clearInputs() {
    if (this.id) {
      this.type = 'edit';
      this.product = await this.productsService.getProductByID(this.id);
      this.form.reset({
        description: '',
        name: '',
        image: '',
        price: 1,
        quantity: 0,
      });
    }
  }

  updateInputProps() {
    this.inputProps = [
      { label: 'Name', name: 'name' },
      { label: 'Price', name: 'price', type: 'number' },
      {
        label: 'Image',
        name: 'image',
        placeholder: 'http://example-image.jpg',
      },
      { label: 'Stock', name: 'quantity' },
      { label: '', name: 'image', type: 'image', disableError: true },
      { label: 'Description', name: 'description', type: 'textarea' },
    ];
  }
  onSubmit(addMore?: boolean): void {
    if (this.form.value && this.form.valid) {
      if (this.type === 'edit')
        this.productsService.editProduct(
          this.form.value as IEditProduct,
          this.id!
        );
      else
        this.productsService
          .createProduct(this.form.value as ICreateProduct, addMore)
          .then(() => {
            if (addMore)
              this.form.reset({
                description: '',
                image: '',
                name: '',
                price: 1,
                quantity: 0,
              });
          });
    }
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxFileDropEntry } from 'ngx-file-drop';
import {
  ICreateProduct,
  IEditProduct,
  IGenericHideState,
  IInputProps,
  IProduct,
} from 'src/app/models';
import { ProductsService, ValidationService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductsFormComponent implements OnInit {
  type: 'edit' | 'create' = 'create';
  product?: IProduct;
  productImageURL?: string = '';
  id?: string | null;

  fb = inject(NonNullableFormBuilder);
  hide!: IGenericHideState<ICreateProduct>;
  inputProps: IInputProps<ICreateProduct>[] = [];
  selectedFile?: File;

  form = this.fb.group<{ [key in keyof ICreateProduct]: any }>({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    image: this.fb.control('', {
      validators: [Validators.required],
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
      this.productImageURL = `${
        environment.BASE_URL
      }/products/uploads/${this.product.image.split('/').pop()}`;
      this.form.patchValue({
        description: this.product.description,
        name: this.product.name,
        image: this.productImageURL,
        price: this.product.price,
        quantity: this.product.stock.quantity,
      });
    }
  }

  async clearInputs() {
    this.form.reset({
      description: '',
      name: '',
      image: '',
      price: 1,
      quantity: 0,
    });
    this.selectedFile = undefined;
  }

  updateInputProps() {
    this.inputProps = [
      { label: 'Name', name: 'name' },
      { label: 'Price', name: 'price', type: 'number' },
      { label: 'Stock', name: 'quantity' },
      { label: '', name: 'image', type: 'image' },
      { label: 'Description', name: 'description', type: 'textarea' },
    ];
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.uploadFile(files);
  }

  private uploadFile(files: NgxFileDropEntry[]) {
    if (files.length === 0) {
      return;
    }

    const fileEntry = files[0].fileEntry as FileSystemFileEntry;
    fileEntry.file((file: File) => {
      if (!file.type.startsWith('image/')) {
        this.form.get('image')?.setErrors({ invalidImageType: true });
        this.form.get('image')?.markAsTouched();
        return;
      }
      this.form.get('image')?.setErrors(null);
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result });
      };
      reader.readAsDataURL(file);
    });
  }

  public fileSelect(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const files: NgxFileDropEntry[] = Array.from(input.files).map(
      (file: File) => ({
        relativePath: file.name,
        fileEntry: {
          isFile: true,
          isDirectory: false,
          name: file.name,
          fullPath: file.name,
          file: (callback: (file: File) => void) => callback(file),
        } as FileSystemFileEntry,
      })
    );

    this.uploadFile(files);
  }

  onSubmit(addMore?: boolean): void {
    if (this.form.value && this.form.valid) {
      if (this.type === 'edit')
        this.productsService.editProduct(
          this.form.value as IEditProduct,
          this.id!,
          this.selectedFile,
          this.product?.stock.quantity !== this.form.value.quantity
        );
      else
        this.productsService
          .createProduct(
            this.form.value as ICreateProduct,
            this.selectedFile,
            addMore
          )
          .then(() => {
            if (addMore)
              this.form.reset({
                description: '',
                image: '',
                name: '',
                price: 1,
                quantity: 0,
              });
            this.selectedFile = undefined;
          });
    }
  }

  navigate(url: string) {
    this.router.navigate([url]);
  }
}

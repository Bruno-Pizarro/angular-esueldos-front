import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import {
  ICreateProduct,
  IEditProduct,
  IEditStock,
  IListResponse,
  IProduct,
} from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsUpdatedSubject = new BehaviorSubject<void>(undefined);
  public productsUpdated$ = this.productsUpdatedSubject.asObservable();
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}
  async getProducts(
    page: number = 1,
    sortBy: string = 'name:asc',
    search?: string
  ) {
    const res = await firstValueFrom(
      this.http.get<IListResponse<IProduct>>(
        `products?page=${page}${sortBy ? `&sortBy=${sortBy}` : ''}${
          search ? `&name=${search}` : ''
        }`
      )
    );
    return res;
  }

  async getProductByID(id: string): Promise<IProduct> {
    try {
      return await firstValueFrom(this.http.get<IProduct>(`products/${id}`));
    } catch (error) {
      this.toastr.error('Product not found');
      this.router.navigate(['/products/management/create']);
      throw error;
    }
  }

  private createProductFormData(
    product: ICreateProduct | IEditProduct,
    imageFile?: File
  ): FormData {
    const formData = new FormData();
    if (product.name) formData.append('name', product.name);
    if (product.description)
      formData.append('description', product.description);
    if (product.price) formData.append('price', product.price.toString());
    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return formData;
  }

  async editProduct(
    product: IEditProduct,
    id: string,
    imageFile?: File,
    stockUpdated?: boolean
  ) {
    const { quantity, ...restOfProduct } = product;
    const formData = this.createProductFormData(restOfProduct, imageFile);
    return await firstValueFrom(this.http.patch(`products/${id}`, formData))
      .then(async () => {
        this.productsUpdatedSubject.next();
        if (quantity && stockUpdated)
          await this.updateStock(
            [{ productId: id, quantity: quantity ?? 0 }],
            stockUpdated
          );
        this.toastr.success('Product updated');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async updateStock(products: IEditStock[], showToast: boolean = true) {
    return await firstValueFrom(this.http.put(`stock/update`, { products }))
      .then(() => {
        this.productsUpdatedSubject.next();
        if (showToast) this.toastr.success('Products stock updated');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async buyProduct(product: IEditStock) {
    return await firstValueFrom(this.http.put(`stock/buy`, product))
      .then(() => {
        this.productsUpdatedSubject.next();
        this.toastr.success('Purchased product');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async createProduct(
    product: ICreateProduct,
    imageFile?: File,
    addMore?: boolean
  ) {
    const { quantity, ...restOfProduct } = product;
    const formData = this.createProductFormData(restOfProduct, imageFile);
    return await firstValueFrom(this.http.post<IProduct>(`products`, formData))
      .then(async (res) => {
        this.productsUpdatedSubject.next();
        if (quantity)
          await this.updateStock([
            { productId: res.id, quantity: quantity ?? 0 },
          ]);
        this.toastr.success('Product created');
        if (!addMore) this.router.navigate([`products/management/${res.id}`]);
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async deleteProduct(id: string) {
    return await firstValueFrom(this.http.delete(`products/${id}`))
      .then(() => {
        this.productsUpdatedSubject.next();
        this.toastr.success('Product deleted');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }
}

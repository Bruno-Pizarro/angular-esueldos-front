import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
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
    return await firstValueFrom(this.http.get<IProduct>(`products/${id}`));
  }

  async editProduct(product: IEditProduct, id: string) {
    return await firstValueFrom(this.http.patch(`products/${id}`, product))
      .then(() => {
        this.productsUpdatedSubject.next();
        this.toastr.success('Product updated');
      })
      .catch(({ error, message }: HttpErrorResponse) => {
        this.toastr.error(error.message ?? message);
      });
  }

  async updateStock(products: IEditStock[]) {
    return await firstValueFrom(this.http.put(`stock/update`, { products }))
      .then(() => {
        this.productsUpdatedSubject.next();
        this.toastr.success('Products stock updated');
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

  async createProduct(product: ICreateProduct, addMore?: boolean) {
    return await firstValueFrom(this.http.post<IProduct>(`products`, product))
      .then((res) => {
        this.productsUpdatedSubject.next();
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

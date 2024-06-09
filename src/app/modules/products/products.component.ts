import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { map, startWith, switchMap } from 'rxjs';
import { IProduct } from 'src/app/models';
import { ProductsService } from 'src/app/services';

export interface IGeneralSorting<T> {
  active: keyof T;
  direction: 'asc' | 'desc';
  label?: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: IProduct[] = [];
  sorts: (typeof this.sorting)[] = [
    { active: 'name', direction: 'asc', label: 'Name [A-Z]' },
    { active: 'name', direction: 'desc', label: 'Name [Z-A]' },
    { active: 'price', direction: 'asc', label: 'Cheapest' },
    { active: 'price', direction: 'desc', label: 'Most Expensive' },
  ];
  sorting: IGeneralSorting<IProduct> = this.sorts[0];
  totalData: number = 0;
  isMobile: boolean = window.screen.width < 600;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private productsService: ProductsService) {}

  ngAfterViewInit() {
    this.productsService.productsUpdated$.subscribe(() => {
      this.paginator.page
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.getProductsData();
          }),
          map((response) => {
            if (response == null) return [];
            this.totalData = response.totalPages * response.results.length;
            return response.results;
          })
        )
        .subscribe((productsData) => {
          this.products = productsData;
        });
    });
  }
  ngOnInit(): void {}

  async getProductsData() {
    const res = await this.productsService.getProducts(
      this.paginator.pageIndex + 1,
      `${this.sorting.active}:${this.sorting.direction}`
    );
    return res;
  }

  async onSelect($event: MatSelectChange) {
    const [active, direction] = $event.value?.split(':');
    this.sorting = this.sorts.find(
      (s) => s.active === active && s.direction === direction
    )!;
    this.products = (await this.getProductsData()).results;
  }
}

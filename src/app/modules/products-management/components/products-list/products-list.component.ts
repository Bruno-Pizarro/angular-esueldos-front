import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { IProduct } from 'src/app/models';
import { MaterialModule } from 'src/app/modules/material';
import { ProductModalComponent } from 'src/app/modules/products-management/components/product-modal';
import { ProductsService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'products-list',
  templateUrl: 'products-list.component.html',
  styleUrls: ['products-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MaterialModule,
    ProductModalComponent,
    RouterModule,
  ],
})
export class ProductsListComponent implements AfterViewInit, OnChanges {
  @Input() selectedProducts: IProduct[] = [];
  @Input() searchInput: string = '';
  @Output() selectionChange = new EventEmitter<IProduct>();
  @Output() onSelectAll = new EventEmitter<IProduct[]>();
  displayedColumns: (keyof IProduct | string)[] = [
    'select',
    'id',
    'name',
    'price',
    'stock',
    'menu',
  ];
  dataSource = new MatTableDataSource<IProduct>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private productsService: ProductsService,
    public auth: AuthService
  ) {
    this.getProductsData();
  }

  productsData: IProduct[] = [];
  totalData: number = 0;

  async ngAfterViewInit() {
    this.dataSource.paginator = this.paginator!;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort: Sort) => {
      this.paginator.pageIndex = 0;
      this.getProductsData();
      this.announceSortChange(sort);
    });

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
          this.productsData = productsData;
          this.dataSource = new MatTableDataSource(this.productsData);
          this.dataSource.sort = this.sort;
        });
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchInput'] && !changes['searchInput'].firstChange) {
      this.applyFilter(this.searchInput);
      this.getProductsData();
    }
  }

  async getProductsData() {
    const sortField = this.sort?.active || '';
    const sortDirection = this.sort?.direction || 'asc';
    const products = await this.productsService.getProducts(
      this.paginator.pageIndex + 1,
      sortField ? `${sortField}:${sortDirection}` : undefined,
      this.dataSource.filter
    );
    return products;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  checkSelected(product: IProduct) {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  onSelectionChange(product: IProduct) {
    this.selectionChange.emit(product);
  }
  async applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim();
    this.dataSource.data = (await this.getProductsData()).results;
  }
}

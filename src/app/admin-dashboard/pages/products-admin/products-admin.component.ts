import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthServiceService } from 'src/app/guards/auth/AuthService.service';
import { ProductAdminComponent } from "../product-admin/product-admin.component";
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/services/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";

@Component({
  selector: 'app-products-admin',
  imports: [RouterOutlet, ProductAdminComponent, ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin.component.html',
})
export class ProductsAdminComponent { 
  ps = inject(ProductsService);
  paginationService = inject(PaginationService)
  productsPerPage = signal<number>(10)

  productsResource = rxResource({
    request: () => ({page:this.paginationService.currentPage() -1, limit:this.productsPerPage()}),
    loader: ({ request }) => {
      return this.ps.getProducts({
        offset:request.page * 9,
        limit: request.limit
      });
    },
  });

}

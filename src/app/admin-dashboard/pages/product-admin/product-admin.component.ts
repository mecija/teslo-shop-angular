import { ProductDetailsComponent } from '@/admin-dashboard/components/product-details/product-details.component';
import { ProductsService } from '@/products/services/products.service';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-product-admin',
  imports: [ProductDetailsComponent],
  templateUrl: './product-admin.component.html',
})
export class ProductAdminComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductsService);
  productID = toSignal(this.activatedRoute.params.pipe(map((p) => p['id'])));

  productResource = rxResource({
    request: () => ({ id: this.productID() }),
    loader: ({ request }) => {
      return this.productService.getProductById(request.id);
    },
  });

  redirectEffect = effect( () => {
    if( this.productResource.error()){
      this.router.navigateByUrl('/')
    }
  })

}

import { ProductsService } from '@/products/services/products.service';
import { Component, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { of } from 'rxjs';
import { ProductCarouselComponent } from "../../../products/components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {
  activatedRoute = inject(ActivatedRoute)
  productSlug = this.activatedRoute.snapshot.params['idSlug']
  ps = inject(ProductsService)

  productsResource = rxResource({
    request: () => ({
        idSlug: this.productSlug
    }),
    loader: ({request}) => {
      if(!request.idSlug) return of();

      return this.ps.getProductByIdSlug(request.idSlug)
    }

  })

 }

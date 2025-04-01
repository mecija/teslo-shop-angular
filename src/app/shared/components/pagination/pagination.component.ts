import { ProductsService } from '@/products/services/products.service';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent { 

  //Paginación base, dependiente del componente padre para obtener las paginas.

  ps = inject(ProductsService)
  currentPage = input<number>(1)
  activePage = linkedSignal(this.currentPage)
  pages = input(0)

  getPagesList = computed( () => {
    return Array.from({length: this.pages()}, (_, i) => i+1)
  })

  


}

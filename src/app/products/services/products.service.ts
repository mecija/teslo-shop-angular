import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import {
  Gender,
  Product,
  ProductsResponse,
} from '../interfaces/product.interface';
import { environment } from 'src/environments/environment.development';
import { User } from 'src/app/guards/auth/interface/user.interface';

const baseURL = environment.baseURL;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  productsListCache = new Map<string, ProductsResponse>();
  productSingleCache = new Map<string, Product>();

  getProducts(options: Options): Observable<ProductsResponse> {
    const { limit = 9, offset = 0, gender = '' } = options;

    const key = `${limit}-${offset}-${gender}`;

    if (this.productsListCache.has(key)) {
      return of(this.productsListCache.get(key)!);
    }

    return this.http
      .get<ProductsResponse>(`${baseURL}/products`, {
        params: { limit, offset, gender },
      })
      .pipe(
        tap((response) => console.log(response)),
        tap((r) => this.productsListCache.set(key, r))
      );
  }

  getProductByIdSlug(id: string): Observable<Product> {
    if (this.productSingleCache.has(id)) {
      return of(this.productSingleCache.get(id)!);
    }

    return this.http.get<Product>(`${baseURL}/products/${id}`).pipe(
      delay(200),
      tap((r) => console.log(r)),
      tap((r) => this.productSingleCache.set(id, r))
    );
  }

  getProductById(id: string): Observable<Product> {
    if (id == 'new') {
      return of(emptyProduct);
    }

    if (this.productSingleCache.has(id)) {
      return of(this.productSingleCache.get(id)!);
    }

    return this.http.get<Product>(`${baseURL}/products/${id}`).pipe(
      delay(200),
      tap((r) => console.log(r)),
      tap((r) => this.productSingleCache.set(id, r))
    );
  }

  updateProductCache(product: Product) {
    const productID = product.id;

    this.productSingleCache.set(productID, product);

    this.productsListCache.forEach((productResponse) => {
      productResponse.products = productResponse.products.map((c) => {
        return c.id == productID ? product : c;
      });
    });

    console.log('Cache actualizada');
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    
    
    const currentImg= productLike.images ?? []

    return this.uploadImages(imageFileList).pipe(
      map( imageNames => ({
        ...productLike,
        images: [...currentImg, ...imageNames]
      })),
      switchMap( (updatedProduct) => {
         return this.http.patch<Product>(`${baseURL}/products/${id}`, updatedProduct)
      }),
      tap( product => this.updateProductCache(product))

      
    )


    // return this.http
    //   .patch<Product>(`${baseURL}/products/${id}`, productLike)
    //   .pipe(tap((pr) => this.updateProductCache(pr)));
  }

  createProduct(
    productLike: Partial<Product>,
    imageFileList?: FileList
  ): Observable<Product> {
    return this.http
      .post<Product>(`${baseURL}/products`, productLike)
      .pipe(tap((pr) => this.updateProductCache(pr)));
  }

  uploadImages(images?: FileList): Observable<string[]> {
    if (!images) {
      return of([]);
    }

    const uploadeObservables = Array.from(images).map((file) =>
      this.uploadImage(file)
    );

    return forkJoin(uploadeObservables);
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http
      .post<{ fileName: string }>(`${baseURL}/files/product`, formData)
      .pipe(map((resp) => resp.fileName));
  }
}

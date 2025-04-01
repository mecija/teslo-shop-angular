import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { Product } from '@/products/interfaces/product.interface';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from '../../../shared/components/form-error-label/form-error-label.component';
import { ProductsService } from '@/products/services/products.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [
    ProductCarouselComponent,
    ReactiveFormsModule,
    FormErrorLabelComponent,
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  router = inject(Router);
  product = input.required<Product>();

  wasSaved = signal(false);
  tempImages = signal<string[]>([])
  imageFileList : FileList | undefined = undefined
  imagesToCarrousel = computed( ()=> {
    const currentProductImages = [...this.product().images, ...this.tempImages()]
    return currentProductImages
  })


  productService = inject(ProductsService);
  fb = inject(FormBuilder);
  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
    tags: [''],
  });

  sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;

    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLocaleLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    console.log(productLike);

    if (this.product().id == 'new') {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike)
      );

      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productService.updateProduct(this.product().id, productLike)
      );

      this.productService
        .updateProduct(this.product().id, productLike, this.imageFileList)
        .subscribe((respuesta) => {});
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onSizeClicked(size: string) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onFilesChanged(event: Event) {
    const filesList = (event.target as HTMLInputElement).files;
    this.tempImages.set([])

    this.imageFileList = filesList ?? undefined

    const imageURLs = Array.from(filesList ?? []).map((file) => {
      return URL.createObjectURL(file);
    });

    this.tempImages.set(imageURLs)
  }
}

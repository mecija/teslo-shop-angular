import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const baseURL = environment.baseURL;

@Pipe({
  name: 'productImagePipe',
})
export class ProductImagePipe implements PipeTransform {
  transform(value: string | null | string[]): unknown {
   
    if(value == null){
      return './assets/images/not-found.jpg';
    }

    if (typeof value == 'string' && value.startsWith('blob:') ) {
      return value
    }

    if (typeof value === 'string') return `${baseURL}/files/product/${value}`;

    const image = value.at(0)
   
    if (!image)
      return './assets/images/not-found.jpg';


    return `${baseURL}/files/product/${value[0]}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import { CategoryService } from '../services/category/category.service';

@Pipe({
  name: 'categoryName',
  standalone: true
})
export class CategoryNamePipe implements PipeTransform {

  constructor(private categoryService: CategoryService){ }
  
  transform(categoryID: number): string {
    return this.categoryService.getCategoryNameById(categoryID);
  }

}

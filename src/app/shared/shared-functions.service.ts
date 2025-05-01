import { Injectable } from '@angular/core';
import { CategoryService } from '../services/category/category.service';

@Injectable({
  providedIn: 'root'
})
export class SharedFunctionsService {
  constructor(private categoryService: CategoryService) { }

  getCategoryName(categoryID: number): string {
    return this.categoryService.getCategoryNameById(categoryID) || "---";
  }
}

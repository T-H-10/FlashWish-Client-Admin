import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../../models/category.model';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl: string;
  private categories:Category[]=[];
  private categoryMap: Map<number, string> = new Map();

  constructor(private http: HttpClient,
  ) {
    this.apiUrl = environment.apiUrl+'/api/Categories';
    this.getAllCategories();
   }

  getAllCategories():Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap((categories: Category[])=>{
        this.categories=categories;
        this.categoryMap=new Map(categories.map((category: Category) => [category.categoryID, category.categoryName]));
      })
    );
  }

  getCategoryNameById(id: number): string {
    return this.categoryMap.get(id)||'---';
  }
  // getCategoryById(id: number): Observable<Category> {
  //   return this.http.get<Category>(`${this.apiUrl}/${id}`);
  // }

  // refreshMap(categories: Category[]) {
  //   this.categories = categories;
  //   this.categoryMap = new Map(categories.map(c => [c.categoryID, c.categoryName]));
  // }

  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`,category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

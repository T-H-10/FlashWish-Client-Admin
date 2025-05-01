import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category/category.service';
import { debounceTime } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { CardsService } from '../../services/cards/cards.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  categories: Category[]=[];
  filteredCategories: Category[]=[];
  searchControl=new FormControl('');

  constructor(private categoryService: CategoryService,
    private cardsService: CardsService
  ){}

  ngOnInit(): void {
    this.getAllCategories();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value=>{
      this.filterCategories(value||'');
    })
  }

  getAllCategories(): void{
    this.categoryService.getAllCategories().subscribe(categories=>{
      this.categories=categories;
      this.filteredCategories=categories;
    })
  }

  countCardsByCategoryId(categoryID: number): number {
    return this.cardsService.getCardsByCategoryId(categoryID).length;
  }

  addCategory(): void{}

  editCategory(category:Category):void{}

  deleteCategory(categoryId:number):void{}

  private filterCategories(searchTerm: string):void{
    const lower=searchTerm.toLowerCase();
    this.filteredCategories=this.categories.filter(category=>
      category.categoryName.toLowerCase().includes(lower)
    );
  }
  
}

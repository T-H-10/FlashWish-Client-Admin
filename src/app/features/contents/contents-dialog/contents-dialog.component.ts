import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { ContentService } from '../../../services/content/content.service';
import { Content } from '../../../models/content.model';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-contents-dialog',
  standalone: true,
  imports: [
        MatTableModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule
  ],
  templateUrl: './contents-dialog.component.html',
  styleUrl: './contents-dialog.component.css'
})
export class ContentsDialogComponent {
  form: FormGroup;
  mode: 'add' | 'edit';
  categories: Category[]=[];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContentsDialogComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', content?: Partial<Content> }
  ){
    this.mode = data.mode;
    this.form = this.fb.group({
      title: [data.content?.title || ''],
      content: [data.content?.content || ''],
      signature: [data.content?.signature || ''],
      categoryID: [data.content?.categoryID || '', Validators.required],
      userID: [data.content?.userID || '1'], // default userID to 1- userAdminId to get from the token!
    });

    if (this.mode === 'edit') {
          this.form.get('userID')?.setValidators(Validators.required);
        }
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    })
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}

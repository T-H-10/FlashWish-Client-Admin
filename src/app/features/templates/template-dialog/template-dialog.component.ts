import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Template } from '../../../models/template.model';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category/category.service';

@Component({
  selector: 'app-template-dialog',
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
  templateUrl: './template-dialog.component.html',
  styleUrl: './template-dialog.component.css'
})
export class TemplateDialogComponent implements OnInit {
  form: FormGroup;
  mode: 'add' | 'edit';
  categories: Category[]=[];
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TemplateDialogComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', template?: Partial<Template> }
  ) {
    this.mode = data.mode;

    this.form = this.fb.group({
      templateName: [data.template?.templateName || '', Validators.required],
      categoryID: [data.template?.categoryID || '', Validators.required],
      userID: [data.template?.userID || localStorage.getItem('userID')||'-1'],//default userID to 1- userAdminId to get from the token!
      imageFile: [data.template?.imageURL || ''],
    });

    if (this.mode === 'edit') {
      this.form.get('userID')?.setValidators(Validators.required);
    }
    if(this.mode === 'add') {
      this.form.get('imageFile')?.setValidators(Validators.required);
    }
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFileName = file.name;
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      this.form.patchValue({ imageFile:  input.files[0] });
    }
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
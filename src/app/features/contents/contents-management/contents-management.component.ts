import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Content } from '../../../models/content.model';
import { ContentService } from '../../../services/content/content.service';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { ContentsDialogComponent } from '../contents-dialog/contents-dialog.component';
@Component({
  selector: 'app-contents-management',
  standalone: true,
  imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule
  ],
  templateUrl: './contents-management.component.html',
  styleUrl: './contents-management.component.css'
})
export class ContentsManagementComponent implements OnInit {
  contents: Content[] = []; // Replace 'any' with your actual content type
  filteredContents: Content[] = []; // Replace 'any' with your actual content type
  searchControl = new FormControl('');

  constructor(private contentService: ContentService,  private dialog: MatDialog ) { }

  ngOnInit(): void {
    this.getAllContents();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.filterContents(value || '');
    });
  }

  getAllContents(): void {
    this.contentService.getAllContents().subscribe(contents => {
      this.contents = contents;
      this.filteredContents = contents;
    });
  }

  addTemplate(): void {
    const dialogRef = this.dialog.open(ContentsDialogComponent, {
      

  filterContents(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredContents = this.contents;
      return;
    }
    this.filteredContents = this.contents.filter(content =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

}

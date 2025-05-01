import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Observable, map, of } from 'rxjs';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-dialog',
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
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css'
})
export class UserDialogComponent {
  form: FormGroup;
  mode: 'add' | 'edit';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', user?: Partial<User> }
  ) {
    this.mode = data.mode;
    this.form = this.fb.group({
      userName: [data.user?.userName || '', [Validators.required, Validators.minLength(3)]],
      email: new FormControl(data.user?.email || '', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [this.checkUseremailExists(this.userService)],
        updateOn: 'blur'
      }),
    });
    if (this.mode === 'add') {
      this.form.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(6)]));
    }
  }

  checkUseremailExists(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return userService.getUserByEmail(control.value).pipe(
        map((user: User | null) => {
          if (!user){
             return null;
          }
          if (this.mode === 'edit' && user?.id === this.data.user?.id) {
            return null;
          }
          
          return { emailExists: true }
        })
      );
    };
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

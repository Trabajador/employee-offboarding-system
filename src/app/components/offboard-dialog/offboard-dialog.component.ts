import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  selector: 'app-offboard-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    A11yModule
  ],
  templateUrl: './offboard-dialog.component.html',
  styleUrls: ['./offboard-dialog.component.css'],
})
export class OffboardDialogComponent implements AfterViewInit {
  offboardForm: FormGroup;
  @ViewChild('firstInput') firstInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OffboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: string }
  ) {
    this.offboardForm = this.fb.group({
      streetLine: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      receiver: ['', Validators.required],
      notes: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.firstInput?.nativeElement?.focus();
    });
  }

  onSubmit(): void {
    if (this.offboardForm.valid) {
      this.dialogRef.close(this.offboardForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

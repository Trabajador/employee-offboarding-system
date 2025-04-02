import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-offboard-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
  ],
  template: `
    <h2 mat-dialog-title>Employee Details</h2>
    <mat-dialog-content>
      <div class="employee-info">
        <p><strong>Name:</strong> {{ data.employee.name }}</p>
        <p><strong>Email:</strong> {{ data.employee.email }}</p>
        <p><strong>Department:</strong> {{ data.employee.department }}</p>
        <p><strong>Status:</strong> {{ data.employee.status }}</p>
      </div>

      <div class="equipment-section">
        <h3>Assigned Equipment</h3>
        <table mat-table [dataSource]="data.employee.equipment" class="equipment-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let item">{{ item.name }}</td>
          </ng-container>

          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let item">{{ item.type }}</td>
          </ng-container>

          <ng-container matColumnDef="serialNumber">
            <th mat-header-cell *matHeaderCellDef>Serial Number</th>
            <td mat-cell *matCellDef="let item">{{ item.serialNumber }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <form [formGroup]="offboardingForm" class="offboarding-form">
        <h3>Offboarding Details</h3>

        <mat-form-field appearance="outline">
          <mat-label>Receiver</mat-label>
          <input matInput formControlName="receiver" placeholder="Enter receiver name">
          @if (offboardingForm.get('receiver')?.invalid && offboardingForm.get('receiver')?.touched) {
            <mat-error>Receiver name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Street Line</mat-label>
          <input matInput formControlName="streetLine" placeholder="Enter street address">
          @if (offboardingForm.get('streetLine')?.invalid && offboardingForm.get('streetLine')?.touched) {
            <mat-error>Street address is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" placeholder="Enter city">
          @if (offboardingForm.get('city')?.invalid && offboardingForm.get('city')?.touched) {
            <mat-error>City is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Postal Code</mat-label>
          <input matInput formControlName="postalCode" placeholder="Enter postal code">
          @if (offboardingForm.get('postalCode')?.invalid && offboardingForm.get('postalCode')?.touched) {
            <mat-error>Postal code is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" placeholder="Enter contact email">
          @if (offboardingForm.get('email')?.invalid && offboardingForm.get('email')?.touched) {
            <mat-error>Please enter a valid email address</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" placeholder="Enter contact phone">
          @if (offboardingForm.get('phone')?.invalid && offboardingForm.get('phone')?.touched) {
            <mat-error>Please enter a valid phone number</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Notes</mat-label>
          <textarea matInput formControlName="notes" placeholder="Additional notes"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="offboardingForm.invalid"
              (click)="onSubmit()">
        Submit Offboarding
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .employee-info {
      margin-bottom: 2rem;
      p {
        margin: 0.5rem 0;
        font-size: 1.1rem;
      }
    }

    .equipment-section {
      margin: 2rem 0;
      h3 {
        margin-bottom: 1rem;
      }
      .equipment-table {
        width: 100%;
        margin-bottom: 2rem;
      }
    }

    .offboarding-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 2rem;

      h3 {
        margin-bottom: 1rem;
      }

      mat-form-field {
        width: 100%;
      }
    }

    mat-dialog-content {
      min-width: 500px;
      max-height: 80vh;
    }

    .mat-mdc-table {
      background: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }
  `]
})
export class OffboardDialogComponent {
  offboardingForm: FormGroup;
  displayedColumns: string[] = ['name', 'type', 'serialNumber'];

  constructor(
    private dialogRef: MatDialogRef<OffboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee: Employee },
    private fb: FormBuilder
  ) {
    this.offboardingForm = this.fb.group({
      receiver: ['', [Validators.required]],
      streetLine: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.offboardingForm.valid) {
      this.dialogRef.close(this.offboardingForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

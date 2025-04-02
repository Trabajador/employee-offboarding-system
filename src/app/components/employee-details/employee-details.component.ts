import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable, Subject, filter, map, switchMap, takeUntil } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { EmployeeStateService } from '../../services/employee-state.service';
import { OffboardDialogComponent } from '../offboard-dialog/offboard-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit, OnDestroy {
  employee$!: Observable<Employee | undefined>;
  displayedColumns: string[] = ['name', 'type', 'serialNumber'];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeState: EmployeeStateService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.employee$ = this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.employeeState.getEmployeeById(id || ''))
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onOffboard(): void {
    const employee = this.employee$.pipe(filter((emp): emp is Employee => emp !== undefined));

    employee.pipe(
      takeUntil(this.destroy$)
    ).subscribe(emp => {
      const dialogRef = this.dialog.open(OffboardDialogComponent, {
        width: '800px',
        data: { employee: emp },
        autoFocus: false,
        disableClose: true
      });

      dialogRef.afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe(result => {
          if (result) {
            this.employeeState.processOffboarding(emp.id, result).subscribe({
              next: () => {
                this.router.navigate(['/']);
              },
              error: (error) => {
                console.error('Error offboarding employee:', error);
              }
            });
          }
        });
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { EmployeeStateService } from '../../services/employee-state.service';
import { Employee } from '../../models/employee.model';
import { AsyncData } from '../../models/async-data.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'email', 'department', 'equipment', 'status'];
  employeesData$: Observable<AsyncData<Employee[]>>;
  searchQuery: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private employeeState: EmployeeStateService,
    private router: Router
  ) {
    this.employeesData$ = this.employeeState.filteredEmployeesData$;
  }

  ngOnInit(): void {
    if (!this.employeeState.hasLoadedEmployees()) {
      this.employeeState.loadEmployees();
    }

    this.employeeState.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.searchQuery = query;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    this.employeeState.setSearchQuery(query);
  }

  onRowClick(employee: Employee): void {
    this.router.navigate(['/employee', employee.id]);
  }

  retryLoading(): void {
    this.employeeState.loadEmployees();
  }

  getEquipmentTooltip(employee: Employee): string {
    if (!employee.equipment?.length) return 'No equipment assigned';
    return employee.equipment
      .map(item => `${item.name} (${item.type}) - SN: ${item.serialNumber}`)
      .join('\n');
  }
}

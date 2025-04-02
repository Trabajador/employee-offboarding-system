import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, map, of, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EmployeeService, OffboardingData, EmployeeStatus } from './employee.service';
import { Employee } from '../models/employee.model';
import { AsyncData, createErrorAsyncData, createInitialAsyncData, createLoadingAsyncData, createSuccessAsyncData } from '../models/async-data.model';

export interface EmployeeState {
  employeesData: AsyncData<Employee[]>;
  searchQuery: string;
}

const initialState: EmployeeState = {
  employeesData: createInitialAsyncData<Employee[]>(),
  searchQuery: ''
};

@Injectable({
  providedIn: 'root'
})
export class EmployeeStateService implements OnDestroy {
  private state = new BehaviorSubject<EmployeeState>(initialState);
  private destroy$ = new Subject<void>();

  // Public observables
  readonly filteredEmployeesData$ = this.state.pipe(
    map(state => ({
      ...state.employeesData,
      data: this.filterEmployees(state.employeesData.data || [], state.searchQuery.toLowerCase())
    })),
    shareReplay(1)
  );

  readonly searchQuery$ = this.state.pipe(
    map(state => state.searchQuery)
  );

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEmployees(): void {
    this.updateState({
      employeesData: createLoadingAsyncData(this.state.value.employeesData.data)
    });

    this.employeeService.getEmployees()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (employees) => {
          this.updateState({
            employeesData: createSuccessAsyncData(employees)
          });
        },
        error: (error) => {
          console.error('Failed to load employees:', error);
          this.updateState({
            employeesData: createErrorAsyncData<Employee[]>(
              'Failed to load employees. Please try again.',
              this.state.value.employeesData.data
            )
          });
        }
      });
  }

  getEmployeeById(id: string): Observable<Employee | undefined> {
    // First try to get from cache
    const cachedEmployee = this.state.value.employeesData.data?.find(emp => emp.id === id);
    if (cachedEmployee) {
      return of(cachedEmployee);
    }

    // If not in cache, make API call
    return this.employeeService.getEmployeeById(id).pipe(
      catchError(error => {
        console.error('Failed to load employee:', error);
        return of(undefined);
      })
    );
  }

  setSearchQuery(query: string): void {
    this.updateState({ searchQuery: query });
  }

  private filterEmployees(employees: Employee[], query: string): Employee[] {
    if (!query) return employees;
    return employees.filter(employee =>
      employee.name.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query)
    );
  }

  hasLoadedEmployees(): boolean {
    return !!this.state.value.employeesData.data?.length;
  }

  private updateState(partialState: Partial<EmployeeState>): void {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }

  processOffboarding(employeeId: string, offboardingData: OffboardingData): Observable<void> {
    this.updateState({
      employeesData: createLoadingAsyncData(this.state.value.employeesData.data)
    });

    return this.employeeService.processOffboarding(employeeId, offboardingData).pipe(
      tap(() => {
        const currentEmployees = this.state.value.employeesData.data;
        if (!currentEmployees) return;

        const updatedEmployees = currentEmployees.map(emp =>
          emp.id === employeeId ? { ...emp, status: EmployeeService.STATUS.OFFBOARDED } : emp
        );

        this.updateState({
          employeesData: createSuccessAsyncData(updatedEmployees)
        });

        this.router.navigate(['/']);
      }),
      catchError(error => {
        this.updateState({
          employeesData: createErrorAsyncData(
            'Failed to offboard employee. Please try again.',
            this.state.value.employeesData.data
          )
        });
        throw error;
      })
    );
  }
}

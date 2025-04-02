import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { Employee } from '../models/employee.model';

export type EmployeeStatus = 'ACTIVE' | 'OFFBOARDED' | 'PENDING';

export interface OffboardingData {
  receiver: string;
  phone: string;
  email: string;
  streetLine: string;
  city: string;
  postalCode: string;
  country: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000/employees';

  // Employee status constants
  static readonly STATUS = {
    ACTIVE: 'ACTIVE' as const,
    OFFBOARDED: 'OFFBOARDED' as const,
    PENDING: 'PENDING' as const
  };

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`);
  }

  updateEmployeeStatus(employeeId: string, status: EmployeeStatus): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${employeeId}`, { status });
  }

  submitOffboardingData(employeeId: string, offboardingData: OffboardingData): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${employeeId}`, { offboardingData });
  }

  // Combines both updating status and handling offboarding data
  processOffboarding(employeeId: string, offboardingData: OffboardingData): Observable<void> {
    return this.updateEmployeeStatus(employeeId, EmployeeService.STATUS.OFFBOARDED).pipe(
      switchMap(() => this.submitOffboardingData(employeeId, offboardingData))
    );
  }
}

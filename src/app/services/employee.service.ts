import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`);
  }

  offboardEmployee(id: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${id}/offboard`, {
      address: {
        streetLine1: data.streetLine,
        country: data.country,
        postalCode: data.postalCode,
        receiver: data.receiver
      },
      notes: data.notes,
      phone: data.phone,
      email: data.email
    });
  }

  updateEmployeeStatus(id: string, status: string): Observable<Employee> {
    return this.http.patch<Employee>(`${this.apiUrl}/employees/${id}`, { status });
  }
}

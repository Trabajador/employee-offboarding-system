import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router'; // Add this

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  searchQuery: string = '';

  // Define the columns to display
  displayedColumns: string[] = ['name', 'email', 'department', 'equipments', 'status'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router // Add this
  ) {}

  ngOnInit(): void {
    this.loadEmployees(); // Load employees on component initialization
  }

  // Load employees from the service
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.employees = data;
    });
  }

  // Filter employees based on search query
  get filteredEmployees(): Employee[] {
    return this.employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        employee.department.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Navigate to employee details page
  viewDetails(employeeId: string): void {
    this.router.navigate(['/details', employeeId]);
  }
}

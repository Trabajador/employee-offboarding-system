import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeStateService } from '../../services/employee-state.service';
import { Employee } from '../../models/employee.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { OffboardDialogComponent } from '../offboard-dialog/offboard-dialog.component';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | undefined;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private employeeStateService: EmployeeStateService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeService.getEmployeeById(id).subscribe((data) => {
        this.employee = data;
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  openOffboardDialog(employeeId: string | undefined): void {
    if (employeeId) {
      const dialogRef = this.dialog.open(OffboardDialogComponent, {
        width: '500px',
        data: { employeeId },
        autoFocus: false,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.employeeService.updateEmployeeStatus(employeeId, 'OFFBOARDED').subscribe(() => {
            if (this.employee) {
              this.employee.status = 'OFFBOARDED';
            }

            this.employeeService.getEmployees().subscribe((employees) => {
              this.employeeStateService.updateEmployees(employees);
            });

            this.router.navigate(['/']);
          });
        }
      });
    }
  }
}

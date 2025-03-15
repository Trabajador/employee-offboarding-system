import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-offboard-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './offboard-form.component.html',
  styleUrls: ['./offboard-form.component.css'],
})
export class OffboardFormComponent implements OnInit {
  offboardForm: FormGroup;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {
    this.offboardForm = this.fb.group({
      streetLine: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
      receiver: ['', Validators.required],
      notes: [''],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
  }

  onSubmit(): void {
    if (this.offboardForm.valid && this.employeeId) {
      this.employeeService.offboardEmployee(this.employeeId, this.offboardForm.value).subscribe(() => {
        this.router.navigate(['/']);
      });
    }
  }
}

import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { OffboardFormComponent } from './components/offboard-form/offboard-form.component';

export const routes: Routes = [
  { path: '', component: EmployeeListComponent },
  { path: 'details/:id', component: EmployeeDetailsComponent },
  { path: 'offboard/:id', component: OffboardFormComponent },
  { path: '**', redirectTo: '' },
];

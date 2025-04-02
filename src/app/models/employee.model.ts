import { EmployeeStatus } from '../services/employee.service';

export interface Equipment {
  name: string;
  type: string;
  serialNumber: string;
}

export interface OffboardingData {
  receiver: string;
  streetLine: string;
  city: string;
  postalCode: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: EmployeeStatus;
  equipment: Equipment[];
  offboardingData?: OffboardingData;
}

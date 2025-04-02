# Employee Offboarding System

A modern Angular application for managing employee offboarding processes, with a focus on equipment return management.

## Features

- View and search employees
- Detailed employee information view
- Equipment tracking
- Offboarding process with form validation
- Real-time state updates without page reloads

## Tech Stack

- Angular 17
- Angular Material
- RxJS
- JSON Server (for mock backend)

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd employee-offboarding-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start both the mock server and the application:
   ```bash
   npm start
   ```
   This will start both:
   - Mock API server at http://localhost:3000
   - Angular application at http://localhost:4200

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── employee-list/       # Main dashboard
│   │   ├── employee-details/    # Employee details view
│   │   └── offboard-dialog/     # Offboarding form dialog
│   ├── models/
│   │   ├── employee.model.ts    # Data interfaces
│   │   └── async-data.model.ts  # Async state wrapper
│   └── services/
│       ├── employee.service.ts  # API communication
│       └── employee-state.service.ts  # State management
```

## Features in Detail

### Employee List
- Displays all employees in a Material table
- Search functionality filters by name or department
- Click on a row to view employee details
- Visual indicators for offboarded employees

### Employee Details
- Comprehensive employee information
- Equipment inventory table
- Offboarding action for active employees

### Offboarding Process
- Form with validation for:
  - Receiver name
  - Street address
  - City
  - Postal code
  - Email
  - Phone
  - Optional notes
- Real-time state updates
- Automatic navigation after successful offboarding

## API Contract

### GET /employees
Returns a list of all employees with their details and equipment.

### GET /employees/:id
Returns detailed information about a specific employee.

### POST /employees/:id/offboard
Processes an employee's offboarding with the following data structure:
```json
{
  "address": {
    "streetLine1": "string",
    "country": "string",
    "postalCode": "string",
    "receiver": "string"
  },
  "notes": "string",
  "phone": "string",
  "email": "string"
}
```

## Assumptions

1. Authentication and authorization are handled by a separate system
2. Equipment is assigned/unassigned through a separate system
3. Offboarding is a one-way process (cannot be undone)
4. All employees must have unique IDs
5. The system operates in a single timezone

## Future Improvements

1. Add unit and integration tests
2. Add loading skeletons
3. Add pagination for large datasets
4. Implement sorting functionality
5. Add equipment assignment/unassignment
6. Add audit logging
7. Add multi-language support
8. Implement advanced search filters

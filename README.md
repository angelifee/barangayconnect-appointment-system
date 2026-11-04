# BarangayConnect

BarangayConnect is a simple Barangay Appointment Booking System prototype. Residents can request an appointment, receive a reference number, and check the status of their request. An administrative view allows appointment statuses to be managed.

## Current features

- Resident appointment booking form
- Duplicate time-slot prevention
- Weekend and public-holiday validation through an external holiday API
- Appointment reference numbers
- Appointment status lookup
- Admin appointment table with status updates
- Repository pattern for appointment storage

## Run locally

1. Install VS Code and the **Live Server** extension.
2. Open this project folder in VS Code.
3. Right-click `index.html` and select **Open with Live Server**.
4. Test booking, status lookup, and the Admin View.

The current prototype stores records in the browser's local storage. It is intended for academic demonstration and does not yet provide production authentication or a server database.

## Project structure

```text
barangay-appointment-system/
├── index.html
├── styles.css
├── src/
│   ├── app.js
│   ├── controllers/appointmentController.js
│   ├── models/appointment.js
│   ├── repositories/appointmentRepository.js
│   └── services/holidayApi.js
└── README.md
```

## Design pattern

The Repository pattern isolates local-storage operations from the controller and user interface. This makes the application easier to maintain and allows the storage method to be replaced later with a database or server API.

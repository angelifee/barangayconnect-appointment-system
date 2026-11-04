import { createAppointment } from '../models/appointment.js';

export class AppointmentController {
  constructor(repository, holidayChecker) {
    this.repository = repository;
    this.holidayChecker = holidayChecker;
  }

  async book(input) {
    const appointment = createAppointment(input);
    const selectedDate = new Date(`${appointment.appointmentDate}T00:00:00`);
    if (selectedDate.getDay() === 0 || selectedDate.getDay() === 6) throw new Error('Appointments are not available on weekends.');
    if (this.repository.hasConflict(appointment.appointmentDate, appointment.appointmentTime)) throw new Error('That time slot is already booked. Please choose another time.');
    const holiday = await this.holidayChecker(appointment.appointmentDate);
    if (holiday) throw new Error(`The selected date is a public holiday: ${holiday.localName}.`);
    return this.repository.save(appointment);
  }
}

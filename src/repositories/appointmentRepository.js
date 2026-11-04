const STORAGE_KEY = 'barangayconnect-appointments';

/** Repository pattern: all appointment storage operations are isolated here. */
export class AppointmentRepository {
  getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  save(appointment) {
    const records = this.getAll();
    records.push(appointment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return appointment;
  }

  updateStatus(id, status) {
    const records = this.getAll().map((record) => record.id === id ? { ...record, status } : record);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }

  findByReference(referenceNumber) {
    return this.getAll().find((record) => record.referenceNumber.toLowerCase() === referenceNumber.trim().toLowerCase());
  }

  hasConflict(date, time) {
    return this.getAll().some((record) => record.appointmentDate === date && record.appointmentTime === time && !['Rejected', 'Cancelled'].includes(record.status));
  }
}

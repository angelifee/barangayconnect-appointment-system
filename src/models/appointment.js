/** Creates a validated appointment record used by the application. */
export function createAppointment(input) {
  const required = ['residentName', 'contactNumber', 'serviceType', 'appointmentDate', 'appointmentTime', 'purpose'];
  for (const field of required) {
    if (!String(input[field] ?? '').trim()) throw new Error('Please complete all appointment fields.');
  }

  const contactNumber = String(input.contactNumber).trim();
  if (!/^[0-9+() -]{7,20}$/.test(contactNumber)) {
    throw new Error('Please enter a valid contact number using numbers and phone symbols only.');
  }

  return {
    id: crypto.randomUUID(),
    referenceNumber: `BRG-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    residentName: input.residentName.trim(),
    contactNumber,
    serviceType: input.serviceType,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    purpose: input.purpose.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
}

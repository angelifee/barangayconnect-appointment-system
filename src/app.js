import { AppointmentRepository } from './repositories/appointmentRepository.js';
import { AppointmentController } from './controllers/appointmentController.js';
import { isPublicHoliday } from './services/holidayApi.js';

const repository = new AppointmentRepository();
const controller = new AppointmentController(repository, isPublicHoliday);
const $ = (selector) => document.querySelector(selector);

const form = $('#appointmentForm');
const message = $('#message');
const residentView = $('#residentView');
const adminView = $('#adminView');

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function renderAdminTable() {
  const filter = $('#statusFilter').value;
  const records = repository.getAll().filter((record) => filter === 'All' || record.status === filter);
  const body = $('#appointmentsTableBody');
  $('#emptyTable').hidden = records.length > 0;
  body.innerHTML = records.map((record) => `
    <tr>
      <td><strong>${record.referenceNumber}</strong></td>
      <td>${record.residentName}<br><small>${record.contactNumber}</small></td>
      <td>${record.serviceType}</td>
      <td>${record.appointmentDate}<br><small>${record.appointmentTime}</small></td>
      <td><span class="status-badge status-${record.status.toLowerCase()}">${record.status}</span></td>
      <td><select class="action-select" data-id="${record.id}" aria-label="Change appointment status">
        ${['Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'].map((status) => `<option ${record.status === status ? 'selected' : ''}>${status}</option>`).join('')}
      </select></td>
    </tr>`).join('');

  const all = repository.getAll();
  $('#totalCount').textContent = all.length;
  $('#pendingCount').textContent = all.filter((item) => item.status === 'Pending').length;
  $('#approvedCount').textContent = all.filter((item) => item.status === 'Approved').length;
  $('#completedCount').textContent = all.filter((item) => item.status === 'Completed').length;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  showMessage('Checking availability and holiday information...');
  try {
    const appointment = await controller.book(Object.fromEntries(new FormData(form)));
    showMessage(`Appointment submitted successfully. Your reference number is ${appointment.referenceNumber}.`);
    form.reset();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

$('#clearForm').addEventListener('click', () => { form.reset(); showMessage(''); });
$('#adminToggle').addEventListener('click', () => { residentView.classList.add('hidden'); adminView.classList.remove('hidden'); renderAdminTable(); });
$('#backToResident').addEventListener('click', () => { adminView.classList.add('hidden'); residentView.classList.remove('hidden'); });
$('#statusFilter').addEventListener('change', renderAdminTable);
$('#appointmentsTableBody').addEventListener('change', (event) => {
  const id = event.target.dataset.id;
  if (!id) return;
  repository.updateStatus(id, event.target.value);
  renderAdminTable();
});

$('#lookupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const result = $('#lookupResult');
  const appointment = repository.findByReference($('#referenceNumber').value);
  if (!appointment) { result.className = 'lookup-result error'; result.textContent = 'No appointment was found for that reference number.'; return; }
  result.className = 'lookup-result';
  result.textContent = `${appointment.referenceNumber}: ${appointment.serviceType} on ${appointment.appointmentDate} at ${appointment.appointmentTime}. Status: ${appointment.status}.`;
});

const dateInput = $('#appointmentDate');
dateInput.min = new Date().toISOString().slice(0, 10);

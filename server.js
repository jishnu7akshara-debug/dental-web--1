const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'appointments.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure data folder exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readAppointments() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading appointments:', err);
    return [];
  }
}

function writeAppointments(list) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing appointments:', err);
    return false;
  }
}

const ALL_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM',
  '05:00 PM', '05:45 PM', '06:30 PM', '07:15 PM', '08:00 PM'
];

// Available slots for a specific date
app.get('/api/slots', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });
  }

  const appointments = readAppointments();
  const bookedSlots = appointments
    .filter(a => a.date === date && a.status !== 'Cancelled')
    .map(a => a.time);

  const slots = ALL_SLOTS.map(slot => ({
    time: slot,
    available: !bookedSlots.includes(slot)
  }));

  res.json({ date, slots });
});

// List all appointments
app.get('/api/appointments', (req, res) => {
  const { status, search, date } = req.query;
  let list = readAppointments();

  if (status && status !== 'all') {
    list = list.filter(item => item.status?.toLowerCase() === status.toLowerCase());
  }
  if (date) {
    list = list.filter(item => item.date === date);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(item =>
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item.service && item.service.toLowerCase().includes(q))
    );
  }

  // Sort by date and time descending
  list.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  res.json(list);
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  const { name, phone, email, service, doctor, date, time, notes } = req.body;

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ error: 'Name, phone, date, and preferred time slot are required.' });
  }

  const list = readAppointments();
  
  // Check if slot already taken
  const conflict = list.find(a => a.date === date && a.time === time && a.status !== 'Cancelled');
  if (conflict) {
    return res.status(409).json({ error: 'This time slot was just booked. Please pick another available slot.' });
  }

  const newAppointment = {
    id: `ARC-${Math.floor(1000 + Math.random() * 9000)}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    service: service || 'General Consultation',
    doctor: doctor || 'First Available Specialist',
    date,
    time,
    status: 'Pending',
    notes: notes ? notes.trim() : '',
    createdAt: new Date().toISOString()
  };

  list.unshift(newAppointment);
  writeAppointments(list);

  res.status(201).json({
    success: true,
    message: 'Appointment request received successfully.',
    appointment: newAppointment
  });
});

// Update appointment
app.patch('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes, date, time, doctor } = req.body;
  const list = readAppointments();
  const index = list.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  if (status) list[index].status = status;
  if (notes !== undefined) list[index].notes = notes;
  if (date) list[index].date = date;
  if (time) list[index].time = time;
  if (doctor) list[index].doctor = doctor;

  writeAppointments(list);
  res.json({ success: true, appointment: list[index] });
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const list = readAppointments();
  const filtered = list.filter(a => a.id !== id);

  if (filtered.length === list.length) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  writeAppointments(filtered);
  res.json({ success: true, message: 'Appointment removed' });
});

// Clinic stats
app.get('/api/stats', (req, res) => {
  const list = readAppointments();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = list.filter(a => a.date === today && a.status !== 'Cancelled').length;
  const pendingCount = list.filter(a => a.status === 'Pending').length;
  const confirmedCount = list.filter(a => a.status === 'Confirmed').length;

  res.json({
    total: list.length,
    today: todayCount,
    pending: pendingCount,
    confirmed: confirmedCount
  });
});

// Serve static frontend files with fast caching for images
app.use(express.static(path.join(__dirname), {
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    if (/\.(webp|png|jpg|jpeg|svg|ico)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    }
  }
}));

// Fallback to index.html for navigation
app.use((req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Arcline Dental Studio server running at http://localhost:${PORT}`);
});

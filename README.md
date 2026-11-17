# Arcline Dental Studio 🦷

A modern, responsive website and appointment management platform for **Arcline Dental Studio**, a boutique dental clinic located in Indiranagar, Bengaluru.

## ✨ Features

- **Unhurried Boutique Aesthetic**: Built with Fraunces & Figtree typography, calm ocean/tide color palette, and sleek architectural arches.
- **Treatments Catalog & Category Filter**: Expandable procedures with durations, guarantees, starting fees, and one-click booking shortcuts.
- **Interactive Before & After Smile Slider**: Draggable comparison slider allowing patients to preview orthodontic and whitening transformations.
- **Treatment Cost & 0% EMI Calculator**: Real-time investment estimator with adjustable 3, 6, 9, 12-month zero-interest payment breakdown.
- **Specialist Profiles**: Detailed credentials and specialties for Dr. Ananya Rao, Dr. Rohan Mehta, and Dr. Sahana Murthy.
- **Dynamic Slot & Booking Engine**:
  - Live availability slot picker (Morning, Afternoon, Evening).
  - Instant reference ID generation (e.g. `ARC-XXXX`).
  - 1-click **Add to Calendar (.ics)** download.
  - Direct **Message on WhatsApp** integration.
- **Clinic Reception Desk (`/admin.html`)**:
  - Real-time appointment management table.
  - Search by patient name, phone number, or reference ID.
  - Instant status controls (Confirm, Complete, Cancel).
  - Walk-in patient booking modal.
  - Live statistics dashboard (total bookings, today's appointments, pending requests).
- **Emergency Dental Protocol**: Dedicated same-day urgent care banner with tap-to-call hotline.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/jishnu7akshara-debug/dental-web--1.git
cd dental-web--1

# Install dependencies
npm install

# Start the server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the website.  
Access the Reception Desk at [http://localhost:3000/admin.html](http://localhost:3000/admin.html).

### Development Mode
```bash
npm run dev
```

## 📁 Project Structure

```
dental-web--1/
├── index.html            # Public website
├── admin.html            # Receptionist & clinic management portal
├── server.js             # Express.js REST API & static server
├── favicon.svg           # Brand vector favicon
├── data/
│   └── appointments.json # JSON database storing appointments
├── images/               # High-resolution clinic & dental imagery
├── package.json
└── README.md
```

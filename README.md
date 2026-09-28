# EyeOnFix: Live Camera Monitored Hardware Service
> **"Watch Your Laptop Fixed Live On Camera. Never Fear Part-Swapping Again."**

An end-to-end transparent laptop repair ecosystem solving the real-world problems of **counterfeit component swapping**, **data privacy leaks**, and **fraudulent repair billing**.

---

## 🌟 Key System Features

1. **Tamper-Evident Doorstep Collection**:
   - Device inspected at doorstep and sealed inside a serialized, tamper-evident security bag (e.g. `SEAL-TX-7842B`).
2. **Automated Google Meet / 4K Workbench Live Stream**:
   - Real-time video link generated for the customer.
   - Live camera switching: **4K Overhead Bench** (full workstation), **Digital Microscope 100X** (micro-soldering / PMIC diagnostics), and **Wide Cleanroom Tray**.
3. **On-Camera Serial Verification & Anti-Swapping Audit**:
   - Old vs. new component serial numbers (RAM, SSD, Display, Battery, PMIC IC) matched live on camera.
4. **Interactive Customer Approval & Audio/Chat**:
   - Customer can inspect multimeter readings, approve or decline quotes live during diagnosis, and communicate directly with the technician.
5. **Post-Repair Payment & 6-Month Warranty**:
   - Customer only pays after verifying test pass; warranty certificate issued with QR and return delivery dispatched.

---

## 🏗️ Architecture & Tech Stack

```
camfix/
├── backend/
│   ├── app.py              # Flask app factory, CORS, blueprints & seed demo data
│   ├── config.py           # MySQL & SQLite configuration, JWT & Google API secrets
│   ├── models.py           # SQLAlchemy relational models
│   ├── requirements.txt    # Python package dependencies
│   ├── schema.sql          # Production MySQL 8.0+ DDL schema with triggers & indexes
│   └── routes/
│       ├── auth.py         # JWT registration, login & @token_required decorator
│       ├── repair.py       # Order CRUD, status milestones & quote approval
│       ├── stream.py       # Google Meet automation & live bench stream controls
│       └── payment.py      # Checkout simulation, digital invoicing & warranty
└── frontend/
    ├── index.html          # HTML5, Plus Jakarta Sans, Space Grotesk fonts
    ├── vite.config.js      # Vite dev server with proxy to backend port 5000
    └── src/
        ├── index.css       # Dark cyber glassmorphism design system & HUD scanlines
        ├── App.jsx         # Main container with role switching & navigation
        ├── components/
        │   ├── Navbar.jsx           # Responsive header with live badge & role toggle
        │   ├── StreamModal.jsx      # Live stream workbench player & chat HUD
        │   └── TamperSealBadge.jsx  # Security seal & hologram badge
        ├── context/
        │   └── AuthContext.jsx      # JWT auth state & seamless demo role switcher
        └── pages/
            ├── LandingPage.jsx      # Hero, problem vs solution matrix, price calculator
            ├── BookRepair.jsx       # 4-Step tamper-seal pickup booking wizard
            ├── UserDashboard.jsx    # Customer 5-stage tracker & stream viewer
            └── TechDashboard.jsx    # Technician cleanroom workbench console
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup (Flask API)
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
*Backend runs on `http://127.0.0.1:5000/api` (Seeds demo customer and technician automatically).*

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend opens at `http://localhost:5174/` (or `http://localhost:5173/`).*

---

## 🔑 Demo Logins (Built-In 1-Click Role Switcher)

You can toggle between roles directly from the top navigation bar:
- **Customer**: `customer@eyeonfix.com` (Arjun Sharma) — View active repairs, watch live stream, approve quotes, pay.
- **Technician**: `tech@eyeonfix.com` (Vikram Verma) — Manage repair queue, start Google Meet live streams, log replaced part serials.

---

## 🗄️ MySQL Database Setup (Optional Production Mode)

To use a full MySQL 8.0 instance instead of the built-in SQLite:
1. Run `backend/schema.sql` inside your MySQL server:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
2. Set environment variables:
   ```bash
   set USE_MYSQL=true
   set MYSQL_USER=root
   set MYSQL_PASSWORD=your_password
   set MYSQL_HOST=localhost
   set MYSQL_DB=eyeonfix_db
   ```

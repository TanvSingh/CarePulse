# 🏥 HealthCare Management System

A modern and scalable healthcare patient management application that allows patients to seamlessly register, book, and manage appointments with doctors. Built with **Next.js**, this app empowers both patients and administrators with real-time features like SMS notifications, secure file uploads, and admin-side appointment control, all in a responsive UI.

---

## 🚀 Features

### 👤 Patient Side
- **Register as a Patient**  
  Easily sign up with your personal details and create a profile.
  
- **Book a New Appointment**  
  Schedule appointments with available doctors at your convenience.

- **Multiple Appointments Supported**  
  Patients can book and manage more than one appointment at a time.

- **Upload Documents Securely**  
  Upload identification or medical documents using **Appwrite Storage**.

---

### 🛠️ Admin Side
- **View & Manage Appointments**  
  Admin dashboard to see and handle all appointments.

- **Confirm or Schedule Appointments**  
  Confirm pending appointments and assign precise date and time.

- **Cancel Appointments**  
  Cancel any appointment with a reason logged for auditing.

---

### 📲 Notifications & Feedback
- **SMS Notifications**  
  Patients receive SMS confirmation after booking or approval (powered by **Twilio**).

- **Real-Time Feedback**  
  Status updates reflected instantly through dynamic UI.

---

### 💻 Technology Stack
- **Frontend**: React (Next.js 14+ App Router)
- **Backend**: Server Actions (Node.js)
- **Database**: Appwrite Cloud DB
- **Auth & User Management**: Appwrite
- **File Storage**: Appwrite Buckets
- **SMS Service**: Twilio Messaging API
- **Monitoring**: Sentry for performance tracking and error reporting

---

## 🧱 Code Architecture & Best Practices

- **Modular File Structure** for better scalability and team collaboration.
- **Reusable Form Components** with `React Hook Form` + `Zod` validation.
- **Server Actions** with API abstraction for clean separation of concerns.
- **Secure Env Handling** using `.env.local` and server/client separation.
- **ESLint + Prettier** setup for consistent and clean codebase.

---

## 📱 Responsiveness

Built with responsive Tailwind CSS layouts ensuring:
- Full support for mobile 📱, tablet 📲, and desktop 🖥️
- Consistent user experience across all screen sizes

---

## 🛡️ Security and Performance

- **Input Validations** via Zod schemas
- **Environment Separation** for client/server secrets
- **Performance Monitoring** using Sentry’s SDK

---

## 📸 Screenshots (optional)

_Add your screenshots here to show off UI and features._

---

## 🔧 Setup Instructions

1. Clone this repo:
   ```bash
   git clone https://github.com/your-username/healthcare-management-system.git

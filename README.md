# Help Desk Ticketing System

A full-stack Help Desk Ticketing System built as an interview assignment using modern technologies.

## Tech Stack

- **Frontend:** React.js
- **Backend:** NestJS
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT
- **Containerization:** Docker & Docker Compose

---

# 🚀 Features

## Customer Features

- Raise Support Ticket
- Track Ticket Status using:
  - Ticket ID
  - Email Address
- View Replies from Support Team

---

## Admin Features

- Secure Login
- View All Tickets
- Filter Tickets:
  - Assigned
  - Unassigned
  - Closed
  - Reassigned
  - Open
  - In Progress
- Assign / Reassign Tickets
- Update Ticket Status
- Reply to Any Ticket
- View Full Message Threads

---

## Agent Features

- Secure Login
- View Assigned Tickets Only
- Update Ticket Status
- Reply to Assigned Tickets
- View Ticket Threads

---

# 📁 Project Structure

```text id="nzt47q"
helpdesk-webapp/
├── be/                  Backend (NestJS)
├── fe/                  Frontend (React)
└── docker-compose.yml

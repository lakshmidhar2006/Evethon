# 🎯 Eventhon — Enterprise Event Management Platform (MERN)

[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-lightgreen?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-blue?logo=express)](https://expressjs.com/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DBFB?logo=react)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Backend Hosted on Render](https://img.shields.io/badge/Backend-Render-purple?logo=render)](https://render.com/)

---

## 🏗️ Overview

**Eventhon** is a full-featured **Event Management Platform** built with the **MERN stack** (MongoDB, Express, React, Node.js).  
It enables **Organizers** to host, manage, and approve events, while **Students** can browse, register, and pay for events.  
An **Admin panel** oversees event approvals, analytics, and reporting — streamlining campus and community event workflows.

---
## 🌐 Live Demo

- **Frontend (Vercel):** [https://evethon.vercel.app](https://evethon.vercel.app)
- **Backend (Render):** [https://evethon.onrender.com](https://evethon.onrender.com)
## 🚀 Features

### 👨‍💼 Organizers
- Create, edit, and manage event drafts  
- Submit events for admin approval  
- Track participant registrations and payments  
- Export registration reports (CSV / PDF)

### 🎓 Students
- Explore and filter published events  
- Register and pay securely  
- Withdraw or view registered events  
- Receive automated confirmation emails

### 🧑‍⚖️ Admins
- Review and approve event submissions  
- Publish or close events  
- Manage organizers and view system logs  
- Generate performance and participation reports  

### ⚙️ Platform-Wide
- JWT-based Authentication & Authorization (cookie-based sessions)  
- RESTful API architecture  
- Responsive UI with glassmorphism + TailwindCSS  
- Secure routes & input validations  
- Real-time updates for registration and approvals using Socket.io
- High-performance query caching with Redis
- Scalable backend (MongoDB Replica-ready)
- Containerized infrastructure with Docker and Nginx reverse proxy

---

## 🧠 System Architecture

```mermaid
flowchart LR
  FE[React Frontend] --> GW[Express API Gateway]
  GW --> AUTH[Auth Service]
  GW --> EVT[Events Controller]
  GW --> REG[Registration Controller]
  GW --> PAY[Payments Controller]
  GW --> REP[Reports Controller]
  AUTH --> MONGO[(MongoDB)]
  EVT --> MONGO
  REG --> MONGO
  PAY --> MONGO
  REP --> MONGO
```

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js, Vite, TailwindCSS, React Query, Axios, Socket.io-client |
| **Backend** | Node.js, Express.js, REST APIs, JWT Auth, Socket.io |
| **Caching & Messaging** | Redis |
| **Database** | MongoDB (Mongoose ORM) |
| **Payments & Reports** | Stripe/Razorpay (mock), CSV exports |
| **Infrastructure** | Docker, Nginx, Docker Compose |
| **Version Control** | Git + GitHub |
| **Testing & API Tools** | Postman, Thunder Client |
| **Deployment** | Dockerized (Ready for AWS/ECR/ECS or Digital Ocean) |

---

## 🖼️ UI Previews

| Home Page | Organizer Dashboard | Admin Dashboard |
|------------|---------------------|-----------------|
| ![Home Page](https://via.placeholder.com/400x250?text=Home+Page) | ![Organizer Dashboard](https://via.placeholder.com/400x250?text=Organizer+Dashboard) | ![Admin Dashboard](https://via.placeholder.com/400x250?text=Admin+Dashboard) |

---

### ⚡ Installation & Setup

#### 🐳 Using Docker (Recommended)
The easiest way to run the entire platform including Redis and MongoDB:
```bash
docker-compose up --build
```
Frontend runs on `http://localhost`, Backend on `http://localhost:4000`.

#### 🛠️ Manual Setup

1️⃣ **Clone the Repository**
```bash
git clone https://github.com/yourusername/eventsphere.git
cd eventsphere
```

2️⃣ **Backend Setup**
```bash
cd server
npm install
npm run dev
```
Create a `.env` file in `/server`:
```env
PORT=4000
MONGODB_URI=your_mongodb_uri
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

3️⃣ **Frontend Setup**
```bash
cd ../client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔐 Authentication Flow

| Action | Endpoint | Role |
|--------|-----------|------|
| Register | `/api/auth/register` | Student/Organizer |
| Login | `/api/auth/login` | All |
| Auth Check | `/api/auth/me` | All |
| Logout | `/api/auth/logout` | All |

---

## 🧾 License

This project is open-source and available under the [MIT License](LICENSE).

---

### 💡 Developed by: **Lakshmidhar Santimalla**
> “Streamlining event workflows through scalable full-stack innovation.”

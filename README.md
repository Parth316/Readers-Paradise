# 📚 Reader’s Paradise

**Version:** 1.0  
**Date:** January 25, 2025

A secure and scalable Library Management System built on the MERN stack (MongoDB, Express.js, React, Node.js). Reader’s Paradise enables seamless book purchasing, and inventory management with a responsive interface and real-time admin control.

---

## 🚀 Features

- 📦 Book purchasing
- 👥 Role-based access for Admins and Users
- 🔐 JWT-based authentication and bcrypt password security
- ⚡ Real-time API with RTK Query
- 🧠 Efficient state management via Redux Toolkit
- 🧪 Integrated testing with Postman & React Testing Library
- 📊 Admin dashboard with inventory tracking
- 🌐 Fully responsive UI using Tailwind CSS

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Security & Privacy](#-security--privacy)
- [Metrics](#-metrics)
- [Contributors](#-contributors)

---

## 🧰 Tech Stack

**Frontend:**

- React (TypeScript)
- Vite
- Redux Toolkit & RTK Query
- Tailwind CSS
- React Router
- Formik
- Axios

**Backend:**

- Node.js + Express.js
- MongoDB + Mongoose
- JWT for auth
- CORS, bcrypt
- GitHub (Version Control)

---

## 🏛️ System Architecture

```
[Frontend (React)] ←→ [Backend (Express)] ←→ [MongoDB]
          ↑                           ↑
       Redux Toolkit              JWT Auth
          ↑                           ↑
      Tailwind UI               Secure APIs
```


## 🔐 Security & Privacy

- **Data Encryption:** HTTPS in production, bcrypt-hashed passwords
- **Authentication:** JWT with role-based access control
- **Validation:** Strong TypeScript-based form validation
- **Risk Mitigation:** Input validation, rate limiting, API testing with Postman

---

## 📊 Metrics

**Development Metrics:**

- ✅ API response time < 500ms (95% of requests)
- 🔐 >99% successful login rate
- 📈 80% test coverage (core services)

**Post-Launch Metrics:**

- 🧩 90% user adoption within 3 months

---

## 👥 Developed by 

- Parth Prajapati  

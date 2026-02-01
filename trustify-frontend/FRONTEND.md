# Trustify (CWT Hackathon Project)

Trustify is a lightweight accountability + transparency app that helps teams or groups track shared funds in a wallet and lets everyone involved monitor activity in real time.

Live Demo: https://cwt-hackathon-trustify.vercel.app/  
API (Backend): https://cwt-hackathon-trustify.onrender.com/

---

## What the app does

Trustify is built around one core idea:

> Funds are placed into a wallet, and everyone involved in the project can monitor it.

It provides a clean workflow for:

- creating and managing wallets
- tracking deposits/updates/transactions
- monitoring wallet activity from a central dashboard

---

## Key Features / Functionalities

### Authentication

- User registration
- User login
- Protected routes (only authenticated users can access wallet and monitoring pages)

### Wallet Management

- Create a wallet (for a project/team)
- View wallet details (balance, history, metadata)
- View wallet history/transactions

### Monitoring & Transparency

- Monitor wallet activity from a dedicated monitoring view
- See changes as they occur
- Clear visibility for all members involved in the project

### General UX

- Responsive UI (works across mobile + desktop)
- Clear dashboards and detail pages for tracking

---

## Tech Stack

### Frontend

- React (Vite)
- Tailwind CSS (UI styling)
- Axios / Fetch for API communication
- Deployed on Vercel

### Backend

- Node.js + Express
- MongoDB (Mongoose)
- CORS-enabled API
- Deployed on Render

---

## Project Structure (Typical)

### Backend (Express)

Common route groups:

- `/api/auth` → authentication (signup/login)
- `/api/wallets` → wallet CRUD + wallet actions
- `/api/monitor` → monitoring endpoints

### Frontend (React)

Common pages:

- Auth pages (Login/Register)
- Dashboard
- Monitor view
- Wallet detail view

---

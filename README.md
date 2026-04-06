# 🚀 Subscription Management Platform

A high-performance, full-stack subscription billing system featuring role-based access control, Stripe Checkout integration, and real-time webhook synchronization.

## 🎯 Purpose

This platform demonstrates a production-grade SaaS architecture focused on:

- **Security:** JWT-based authentication and protected API signatures  
- **Billing:** Recurring revenue cycles with Stripe and idempotent webhook handling  
- **Observability:** DevOps monitoring for system health and business metrics

## 🛠 Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express, Mongoose, Stripe SDK |
| Database | MongoDB Atlas |
| Infrastructure | Docker, Nginx, Azure VM |
| Monitoring | Prometheus, Grafana |

## ✨ Core Features

### 🔐 Authentication & Roles

- **Multi-Role Auth:** Specialized workflows for customer (billing management) and admin (plan lifecycle)
- **Security:** Protected routes via JWT and Stripe webhook signature verification

### 💳 Billing Intelligence

- **Stripe Integration:** Seamless Checkout for initial subscriptions and plan upgrades/downgrades
- **State Sync:** Webhook-driven synchronization for `active`, `past_due`, and `canceled` states
- **Idempotency:** Unique indexing on Payment Intent IDs to prevent duplicate database writes

### 📊 Monitoring & Analytics

- **Business Metrics:** Real-time tracking of MRR, Churn Rate, and Total Revenue
- **System Health:** Prometheus endpoint (`/metrics`) tracking CPU, memory, and event loop lag

## ♾️ DevOps & Deployment

### 🐳 Containerization

The application is fully containerized using a multi-stage Docker build for optimized image sizes.

- **Frontend:** Served via Nginx (Alpine) with custom routing to support SPA refreshes
- **Backend:** Node.js production runtime

### 🌐 Infrastructure & Networking

- **Reverse Proxy:** Nginx acts as a gateway, handling SSL termination (Certbot/Let’s Encrypt) and routing traffic between `/` (Frontend) and `/api` (Backend)
- **Cloud Hosting:** Deployed on Azure Virtual Machines and orchestrated via Docker Compose

### 📈 Observability Stack

- **Prometheus:** Scrapes application metrics through the internal Docker network
- **Grafana:** Visualizes system performance and business KPIs through custom dashboards

## ⚙️ Environment Configuration

### Backend (`subs_backend/.env`)

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Frontend (`subs_frontend/.env`)

- `VITE_API_URL=https://yourdomain.com/api`

## 🚀 Local Quickstart

### 1. Install Dependencies

```bash
# Backend
cd subs_backend
npm install

# Frontend
cd ../subs_frontend
npm install
```

### 2) Run backend
```bash
cd subs_backend
npm run dev
```

#### 3) Run frontend
```bash
cd subs_frontend
npm run dev
```

#### 4) Start Stripe webhook listener
```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```
Copy the generated webhook signing secret and set STRIPE_WEBHOOK_SECRET in backend .env, then restart backend.


Built for high-scale subscription workflows.

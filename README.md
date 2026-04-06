# Subscription Management Platform

A full-stack subscription billing system with role-based access, Stripe Checkout integration, webhook-driven state sync, and analytics dashboards.

## Purpose

This project demonstrates how a SaaS subscription system works end-to-end in a production-like setup.

It focuses on:

- user authentication and authorization
- role-based workflows (admin vs customer)
- recurring billing with Stripe
- webhook verification and idempotent event handling
- business metrics like MRR, revenue, subscribers, and churn

## Core Features

### Auth

- Register / Login with JWT
- Protected API routes
- Current user endpoint: `/api/auth/me`

### Roles

- `customer`: subscribe, switch plan, schedule cancellation
- `admin`: create plans, delete plans (with safety checks)

### Billing

- Stripe Checkout for first-time subscription
- Plan switching on active subscriptions
- Cancel at period end

### Webhooks

- Signature verification with Stripe webhook secret
- Handles checkout completion and invoice events
- Idempotent payment writes to avoid duplicate inserts
- Syncs subscription status and period dates to MongoDB

### Dashboard

- Total subscribers
- Monthly recurring revenue (MRR)
- Total revenue
- Churn snapshot
- Customer subscription status panel

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, Mongoose, JWT, Stripe SDK
- Database: MongoDB Atlas
- Monitoring: Prometheus metrics endpoint (`/metrics`)

## Project Structure

- `subs_backend` - API server, auth, plans, subscriptions, webhooks
- `subs_frontend` - React app (landing, auth, dashboard, plans)

## Environment Variables

### Backend (`subs_backend/.env`)

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Frontend (`subs_frontend/.env`)

- `VITE_API_URL=http://localhost:5000/api`

## Local Setup

### 1) Install dependencies

```bash
cd subs_backend
npm install

cd ../subs_frontend
npm install
```
##2) Run backend
```bash
cd subs_backend
npm run dev
```

#3) Run frontend
```bash
cd subs_frontend
npm run dev
```

#4) Start Stripe webhook listener
```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```
###Copy the generated webhook signing secret and set STRIPE_WEBHOOK_SECRET in backend .env, then restart backend.



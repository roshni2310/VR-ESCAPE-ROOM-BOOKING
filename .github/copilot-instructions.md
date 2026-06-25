<!-- VR Escape Room Booking System - Project Setup Instructions -->

# VR Escape Room Booking System Setup

## Project Overview
A full-stack booking and inventory management engine for an interactive entertainment venue with:
- Dual room capacity management preventing double-booking
- Digital liability e-signatures (DocuSign/Adobe Sign integration)
- Cost-splitting for group reservations
- Payment processing (Stripe)
- User authentication & authorization

## Tech Stack
- **Backend**: Node.js + Express.js
- **Frontend**: React + Redux
- **Database**: MongoDB (primary) + PostgreSQL (optional for relational data)
- **Authentication**: Passport.js + JWT
- **Payment**: Stripe API
- **E-Signatures**: DocuSign API
- **Cloud**: AWS (optional)

## Setup Checklist

- [ ] **Verify Project Requirements**
  - Full-stack application confirmed
  - Backend API with Node.js/Express
  - React frontend
  - MongoDB database
  - Authentication, payments, e-signatures included

- [ ] **Scaffold Backend Project**
  - Initialize Node.js project with Express.js
  - Set up folder structure (routes, controllers, models, middleware)
  - Create environment configuration files
  - Install core dependencies

- [ ] **Scaffold Frontend Project**
  - Create React application
  - Set up Redux store structure
  - Create component folder structure
  - Install UI and utilities libraries

- [ ] **Setup Database**
  - Create MongoDB connection configuration
  - Design and document schema
  - Set up database migration scripts

- [ ] **Implement Core Features**
  - User authentication system
  - Booking management API
  - Inventory/slot management
  - Payment processing integration
  - E-signature workflow

- [ ] **Create Documentation**
  - API documentation
  - Database schema documentation
  - Deployment guide
  - Development environment setup

- [ ] **Configure VS Code Tasks**
  - Backend start task
  - Frontend start task
  - Database initialization task


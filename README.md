# devFest-Enhanced-Quality-of-Experience-
This project addresses the challenge of improving the Quality of Experience (QoE) for satellite broadband users sharing bandwidth. Our solution dynamically allocates bandwidth to clients based on real-time traffic shaping, ensuring optimal performance even under bandwidth constraints.
# FastAPI Registration with Email Verification

This FastAPI application implements user registration with email verification using a temporary user model (`TempUser`) before finalizing the registration process.

## Features
- **User Registration**: Register users using a username, email, and password.
- **Password Hashing**: Passwords are securely hashed before being stored in the database.
- **Email Verification**: After successful registration, a verification email is sent to the user with a code to complete the registration.
- **Frontend Integration**: A simple frontend form that interacts with the backend via JavaScript.

---

## Table of Contents
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)
- [Registration and Verification Flow](#registration-and-verification-flow)
- [Testing](#testing)

---

## Installation

### Backend (FastAPI)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/fastapi-registration.git
   cd fastapi-registration


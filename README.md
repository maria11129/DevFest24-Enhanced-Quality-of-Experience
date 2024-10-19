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
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows, use 'venv\Scriptsctivate'
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   - The application uses SQLite by default. If you're using a different database, update the connection string in `database.py`.
   ```bash
   alembic upgrade head  # For database migrations
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

---

### Frontend (HTML + JavaScript)

1. Ensure you have a static folder with the frontend files.
2. Place your `index.html` (registration page) and the corresponding `script.js` in the `static` directory.
3. The backend will serve these static files.

---

## Running the Application

1. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

2. Open the `index.html` file in your browser or navigate to `http://127.0.0.1:8000` if using a FastAPI static route.

3. When you register a user, the application will prompt for a verification code after registration.

---

## API Endpoints

### 1. `POST /register`
Registers a new user temporarily. The user's email is validated, and the password is hashed. This endpoint also verifies that the email does not already exist in the system.

#### Request:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "Password123",
  "verify_password": "Password123"
}
```

#### Response:
```json
{
  "message": "Registration successful. Verification email sent."
}
```

#### Errors:
- `400 Bad Request`: If the email already exists.
- `400 Bad Request`: If the passwords don't match.

### 2. `POST /verify`
Verifies the user's registration by matching the verification code sent via email.

#### Request:
```json
{
  "email": "user@example.com",
  "verification_code": "123456"
}
```

#### Response:
```json
{
  "message": "Email verified successfully. Registration completed."
}
```

---

## Frontend Integration

### Registration Form

The `index.html` form allows users to register by entering their username, email, password, and confirming their password.

### JavaScript (`script.js`)

This file handles form submissions and makes the necessary POST requests to the backend API. After successful registration, it shows a verification input field.

Example JavaScript flow:

1. **Registration:**
   - The registration form is submitted via a `fetch` POST request to `/register`.
   - On success, the form is hidden, and the user is asked for the verification code.

2. **Verification:**
   - After registration, a verification code is sent to the user's email. The user enters this code to complete the registration process.

```javascript
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form submission

    // Collect form data
    const username = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const verifyPassword = document.getElementById("verify-password").value;

    // Send registration data to backend
    fetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, verify_password: verifyPassword })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // Show success message
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("verification-section").style.display = "block";
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("error-message").textContent = error.message;
    });
});
```

---

## Registration and Verification Flow

1. **User Registration**:
    - Users input their username, email, and password (along with a password confirmation).
    - A `POST` request is made to the `/register` endpoint.
    - If the registration is successful, a verification email is sent to the user.

2. **Email Verification**:
    - After registration, the user receives a verification email with a code.
    - The user enters the verification code into the verification form.
    - A `POST` request is made to `/verify` to complete the registration.

3. **Completion**:
    - Once the verification code is confirmed, the user’s account is fully created, and the registration process is complete.

---

## Testing

You can test the flow by running the backend on `localhost` and using Postman or your browser to register users.

1. **Register a New User**:
   - Make a `POST` request to `/register` with the necessary data.
   - Ensure the email doesn’t already exist, and that the passwords match.

2. **Verify User Email**:
   - Use the verification code sent to your email and make a `POST` request to `/verify`.

---

## Notes

- You may need to configure your email provider for sending verification emails. This app supports various email backends like SMTP, Mailgun, etc.
- Modify `settings.py` (or equivalent config file) to set up email sending.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

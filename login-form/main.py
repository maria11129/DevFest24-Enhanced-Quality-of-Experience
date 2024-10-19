from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

# Dummy database
users_db = {
    "user@example.com": {
        "email": "user@example.com",
        "password": "password123"
    }
}
# Login: The POST /login endpoint checks if the user's email and password exist in the users_db. If they do, it responds with "Login successful"; otherwise, it raises an error.
# Sign-Up: The POST /signup endpoint registers a new user if the email is not already taken, and the passwords match. It adds the user to users_db.
# User model for login and sign-up

class User(BaseModel):
    email: str
    password: str

class SignUpUser(User):
    confirm_password: str

# Login endpoint
@app.post("/login")
async def login(user: User):
    if user.email not in users_db:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if users_db[user.email]["password"] != user.password:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    return {"message": "Login successful"}

# Sign-up endpoint
@app.post("/signup")
async def sign_up(user: SignUpUser):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Add user to database
    users_db[user.email] = {
        "email": user.email,
        "password": user.password
    }

    return {"message": "Sign-up successful!"}

# Run the app with Uvicorn
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

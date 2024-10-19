from fastapi import FastAPI, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import engine
from datetime import datetime, timedelta
from dotenv import load_dotenv
from hashing import Hash
from fastapi.middleware.cors import CORSMiddleware
import models, schemas, database, emailVerification, os, random, jwt

# Load environment variables from .env file
load_dotenv()

app = FastAPI()


 # Replace with your frontend origin

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Your frontend origin (adjust accordingly)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load the secret key from environment variables
SECRET_KEY = os.getenv('your_secret_key')  # Ensure this key exists in your .env file
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  

# Create database tables
models.Base.metadata.create_all(engine)

temp_user = schemas.temp_User

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.options("/register")
async def options_register():
    return {"allowed_methods": ["POST", "OPTIONS"]}

@app.post('/register', status_code=status.HTTP_200_OK, tags=['Login Page'])
async def register(request: schemas.NewUser, db: Session = Depends(get_db)):
    # Check if email already exists in Users table
    existing_email = db.query(models.Users).filter(models.Users.email == request.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists.")

    # Check if email already exists in TempUsers table
    existing_temp_email = db.query(models.TempUser).filter(models.TempUser.email == request.email).first()
    if existing_temp_email:
        raise HTTPException(status_code=400, detail="Email already used for a pending verification.")

    # Verify password match
    if request.password != request.verify_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    # Hash the password
    hashed_passwd = Hash.hashIt(request.password)

    # Add the new temporary user for verification
    temp_user = models.TempUser(username=request.username, email=request.email, password=hashed_passwd)
    
    return {"message": "Registration successful."}
    

@app.post('/verify-code', status_code=status.HTTP_200_OK, tags=['Login Page'])
async def verify_code( db: Session = Depends(get_db)):
    # # Retrieve the temporary user data
    #verified_user = db.query(models.TempUser).filter(models.TempUser.email == request.email).first()
    # # Verify the provided code
    # if temp_data['verification_code'] != code:
    #     raise HTTPException(status_code=400, detail="Invalid verification code.")
    
    # # Check if the verification code has expired
    # if datetime.utcnow() > temp_data["code_expires_at"]:
    #     raise HTTPException(status_code=400, detail="Verification code has expired.")

    # If all checks pass, create a new user in the database
    print(f"the email of sifi is : {temp_user.email}" )
    new_user = models.Users(Username = temp_user.username, email = temp_user.email, password = temp_user.password)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Remove from temp store after successful registration
    # del temp_user_store[]

    return {"message": "Registration successful!"}

@app.post('/login', status_code=status.HTTP_200_OK, tags=['Login Page'])
async def login(request: schemas.User, db: Session = Depends(get_db)):
    # Check if the user exists and verify the password
    db_user = db.query(models.Users).filter(models.Users.email == request.email).first()
    if not db_user or not Hash.verify_hash(request.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": db_user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)  # Use the defined expiry time
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

from pydantic import BaseModel,EmailStr, validator


class User(BaseModel):
    email : EmailStr
    password : str

class NewUser(User):
    username : str
    verify_password : str
    @validator('password')
    def password_must_be_complex(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long.')
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one numeral.')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter.')
        if not any(char.islower() for char in v):
            raise ValueError('Password must contain at least one lowercase letter.')
        if not any(char in '!@#$%^&*()_+' for char in v):
            raise ValueError('Password must contain at least one special character.')
        return v


class temp_User(BaseModel):
    username : str
    email : EmailStr
    password : str
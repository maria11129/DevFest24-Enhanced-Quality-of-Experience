from passlib.context import CryptContext

pwd_hash = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Hash():
    @staticmethod
    def hashIt(password: str):
        return pwd_hash.hash(password)
    @staticmethod
    def verify_hash(Normal_password, Hashed_password) -> bool:
        return pwd_hash.verify(Normal_password, Hashed_password)
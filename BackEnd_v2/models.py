from sqlalchemy import Column,Integer,String, DateTime
from database import Base
from datetime import datetime
class Users(Base):
    __tablename__ = "Users"
    id = Column(Integer,primary_key=True,index=True)
    Username = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)

class TempUser(Base):
    __tablename__ = "temp_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
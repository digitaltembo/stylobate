import bcrypt
from sqlalchemy import Column, Boolean, Integer, String
import datetime
import jwt
from pydantic import BaseModel

from sql import Base
from utils.config import SECRET_KEY

TWO_WEEKS = datetime.timedelta(days=14)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer(), primary_key=True)
    email = Column(String(255), unique=True)
    password = Column(String(255), nullable=False)

    is_superuser = Column(Boolean(), default=False)

    def __init__(self, email: str, password: str, is_superuser: bool = False, id: int = 0):
        self.email = email
        self.password = User.hashed_password(password)
        self.is_superuser = is_superuser
        self.id = id

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_superuser": self.is_superuser,
        }

    def generate_token(self, expiration: datetime.timedelta=TWO_WEEKS):
        user_dict = self.to_dict()
        user_dict["exp"] = datetime.datetime.utcnow() + TWO_WEEKS
        return jwt.encode(user_dict, SECRET_KEY, algorithm='HS256')

    @staticmethod
    def hashed_password(password: str):
        return bcrypt.hashpw(password, bcrypt.gensalt())

    @staticmethod
    def password_matches(password: str, user: str):
        return bcrypt.checkpw(password, user.password)

    @staticmethod
    def find_user(db, email: str, password: str):
        user = db.query(User).filter(User.email == email).first()
        if user and User.password_matches(password, user):
            return user
        else:
            return None

    @staticmethod
    def verify_token(token: str):
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
            print(data)
            return User(data['email'], '', data['is_superuser'], id=data['id'])
        except:
            return None

class UserBaseType(BaseModel):
    email: str

class UserCreateType(UserBaseType):
    email: str 
    password: str
    is_superuser: bool

class UserType(UserBaseType):
    id: str
    email: str
    is_superuser: bool

    class Config:
        orm_mode = True
import bcrypt
from sqlalchemy import Column, Boolean, Integer, String
import datetime
import jwt
from pydantic import BaseModel

from sql import Base
from utils.config import SECRET_KEY

TWO_WEEKS = datetime.timedelta(days=14)

# SQLAlchemy ORM Model

class User(Base):
    __tablename__ = "users"

    id = Column(Integer(), primary_key=True)
    email = Column(String(255), unique=True)
    password = Column(String(255), nullable=False)

    isSuperuser = Column('is_superuser', Boolean(), default=False, nullable=False )

    def __init__(self,  id: int = 0, email: str = '', password: str = '', isSuperuser: bool = False):
        self.email = email
        self.password = User.hashed_password(password)
        self.isSuperuser = isSuperuser
        self.id = id

    def generate_token(self, expiration: datetime.timedelta=TWO_WEEKS):
        user_dict = UserType.from_orm(self).dict()
        user_dict["exp"] = datetime.datetime.utcnow() + TWO_WEEKS
        return jwt.encode(user_dict, SECRET_KEY, algorithm='HS256')

    @staticmethod
    def hashed_password(password: str):
        return bcrypt.hashpw(password, bcrypt.gensalt())

    @staticmethod
    def password_matches(password: str, user):
        return bcrypt.checkpw(password, user.password)

    @staticmethod
    def verify_token(token: str):
        try:
            data = UserType.parse_obj(jwt.decode(token, SECRET_KEY, algorithms='HS256'))
            return data.to_user()
        except:
            return None

    @staticmethod
    def create_superuser(email: str, password: str):
        print("INSERT INTO users (email, password, is_superuser) VALUES ('{}','{}', 1);".format(email, User.hashed_password(password)))


# Pydantic Data Schemas
class UserBaseType(BaseModel):
    email: str

class UserCreateType(UserBaseType):
    email: str 
    password: str

    def to_user(self):
        return User(
            email       = self.email,
            password    = User.hashed_password(self.password)
        )

class UserType(UserBaseType):
    id: int
    email: str
    isSuperuser: bool

    def to_user(self) -> User:
        return User(
            id          = self.id,
            email       = self.email,
            isSuperuser = self.isSuperuser
        )

    class Config:
        orm_mode = True
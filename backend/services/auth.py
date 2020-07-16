from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from utils.api import Okay, Failed, UserAuth
from db.models import User, UserType, UserCreateType
from sql import get_db

router = APIRouter()

class LoginResult(Okay):
    token: str 

@router.post('/login', response_model = LoginResult)
async def login(credentials: UserCreateType, db: Session = Depends(get_db)):
    user = User.find_user(db, credentials.email, credentials.password)
    if not user:
        raise Failed('wrong', 'Incorrect Username')
    return LoginResult(token=user.generate_token())
        

class ValidateToken(BaseModel):
    token: str 

@router.post('/validate_token', response_model = LoginResult)
async def validate_token(token: ValidateToken):
    is_valid = User.verify_token(token.token)
    if not is_valid:
        raise Failed('wrong', 'Invalid Token')
    return LoginResult(token=token.token)


@router.post('/info', response_model = UserType)
def hello(auth = Depends(UserAuth)):
    return auth.user

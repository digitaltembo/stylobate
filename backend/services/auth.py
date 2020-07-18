from typing import Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from utils.api import Failure, UserAuth, StyloRouter
from db.models import User, UserType, UserCreateType
from sql import get_db

router = StyloRouter('auth', 'Endpoints to deal with user authentication and/or authorization')

class LoginResult(UserType):
    token: str 

def make_login_result(user: User, token: Optional[str] = None) -> LoginResult:
    return LoginResult(
        id=user.id,
        email=user.email,
        isSuperuser=user.isSuperuser,
        token=token if token else user.generate_token()
    )


@router.post(
    '/login', 
    response_model = LoginResult,
    summary='Login user',
    response_description='If correct, return id, email, and isSuperuse status of user, in addition to the JSON Web Token'
)
async def login(credentials: UserCreateType, db: Session = Depends(get_db)):

    user: Optional[User] = db.query(User).filter(User.email == credentials.email).first()

    if not user or not User.password_matches(credentials.password, user):
        raise Failure('wrong', 'Incorrect Username or Password')

    return make_login_result(user)

class ValidateToken(BaseModel):
    token: str 

@router.post('/validate_token', response_model = LoginResult)
async def validate_token(token: ValidateToken):
    valid_user: User = User.verify_token(token.token)
    if not valid_user:
        raise Failure('wrong', 'Invalid Token')
    return make_login_result(valid_user, token.token)


@router.post(
    '/info', 
    response_model = UserType,
    summary='Example function demonstrating endpoints requiring authentication'
)
def hello(auth = Depends(UserAuth)):
    return auth.user

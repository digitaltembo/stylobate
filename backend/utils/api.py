from abc import ABC, abstractmethod 
from fastapi import Header, HTTPException
from fastapi.responses import JSONResponse
from typing import TypeVar, Generic

from typing import Optional
from pydantic import BaseModel
from pydantic.generics import GenericModel

from db.models import User

class Okay(BaseModel):
    result='success'

class Failed(Exception):
    status_code: int = 400
    code: str = ''
    message: str = ''
    result: str = 'failure'

    def __init__(self, error_code, error_message, status_code = 400):
        self.code = error_code 
        self.message = error_message
        self.status_code = status_code

    def is_okay(self):
        return False
    def to_response(self):
        return JSONResponse(
            status_code=self.status_code,
            content = {
                "result"        : 'failure',
                "error_code"    : self.code,
                "error_message" : self.message 
            }

        )

class UserAuth:
    user: User
    def __init__(self, authentication: Optional[str] = Header(None)):
        if authentication:
            self.user = User.verify_token(authentication)
            if not self.user:
                raise Failed("invalid_auth", "Invalid or Expired authentication", 401)
        else:
            raise Failed("no_auth", "Authentication required", 401) 

class SuperUserAuth:
    def __init__(self, authentication: Optional[str] = Header(None)):
        if authentication:
            self.user = User.verify_token(authentication)
            if not self.user or not self.user.is_superuser:
                raise Failed("invalid_auth", "Invalid or Expired authentication", 401)
        else:
            raise Failed("no_auth", "Authentication required", 401) 




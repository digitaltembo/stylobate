from abc import ABC, abstractmethod 
from fastapi import Header, HTTPException, FastAPI, APIRouter
from fastapi.responses import JSONResponse
from typing import TypeVar, Generic

from typing import Optional, Tuple, List
from pydantic import BaseModel
from pydantic.generics import GenericModel

from db.models import User


class Failure(Exception):
    statusCode: int
    code: str
    message: str
    result: str
    data: any

    def __init__(self, errorCode, errorMessage, statusCode = 400, data = {}):
        self.code = errorCode 
        self.message = errorMessage
        self.statusCode = statusCode
        self.data = data

    def is_okay(self):
        return False
    def to_response(self):
        return JSONResponse(
            status_code=self.statusCode,
            content = {
                "result"       : 'failure',
                "errorCode"    : self.code,
                "errorMessage" : self.message 
            }
        )

class FormFailure(Failure):
    def __init__(self, errors: List[Tuple[str,str]]):
        self.super('form_failure', 'Invalid Form Submission', data=errors)

class UserAuth:
    user: User
    def __init__(self, authentication: Optional[str] = Header(None)):
        if authentication:
            self.user = User.verify_token(authentication)
            if not self.user:
                raise Failure("invalid_auth", "Invalid or Expired authentication", 401)
        else:
            raise Failure("no_auth", "Authentication required", 401) 

class SuperUserAuth:
    def __init__(self, authentication: Optional[str] = Header(None)):
        if authentication:
            self.user = User.verify_token(authentication)
            if not self.user or not self.user.is_superuser:
                raise Failure("invalid_auth", "Invalid or Expired authentication", 401)
        else:
            raise Failure("no_auth", "Authentication required", 401) 

class StyloRouter(APIRouter):
    serviceName: str 
    description: str 

    def __init__(self, serviceName, description):
        self.serviceName = serviceName
        self.description = description

        super().__init__()

class StyloAPI(FastAPI):
    def __init__(self, routers: List[StyloRouter]):
        tags_metadata = [{"name": r.serviceName, "description": r.description} for r in routers]
        super().__init__(openapi_tags = tags_metadata)

        for router in routers:
            self.include_stylo_router(router)

    def include_stylo_router(self, router: StyloRouter):
        self.include_router(router, prefix='/api/' + router.serviceName, tags=[router.serviceName])





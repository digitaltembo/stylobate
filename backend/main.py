from fastapi import FastAPI, Request
from services import auth
from utils.api import Failed
from utils.config import IS_PROD

app = FastAPI()

app.include_router(auth.router, prefix='/api/auth', tags=['auth'])

@app.exception_handler(Failed)
async def failure_exception_handler(request: Request, failure: Failed):
    return failure.to_response()

if IS_PROD:
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static" )
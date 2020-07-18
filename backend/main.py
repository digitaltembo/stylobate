from fastapi import Request
from services import auth
from utils.api import Failure, StyloAPI
from utils.config import SERVE_STATIC

app = StyloAPI([auth.router])

@app.exception_handler(Failure)
async def failure_exception_handler(request: Request, failure: Failure):
    return failure.to_response()

if SERVE_STATIC:
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="static" )
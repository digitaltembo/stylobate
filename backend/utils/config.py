import os

def get_config(envName: str, default: str) -> str:
    return os.getenv(envName) or default 

SERVER: str        = get_config("SERVER", "UVICORN")
IS_PROD: bool      = get_config("IS_PROD", "Nah") == "TRUE"
SERVE_STATIC: bool = IS_PROD and SERVER == "UVICORN"
SECRET_KEY: str    = get_config("SERVER_SK", "WOWZA")

# alternatively: "postgresql://user:password@postgresserver/db"
DB_URL: str        = get_config("SERVER_DB", "sqlite:///the.db") 


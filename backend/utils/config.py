import os

def get_config(env_name: str, default: str) -> str:
    return os.getenv(env_name) or default 

IS_PROD: bool   = get_config("IS_PROD", "Nah") == "TRUE"
SECRET_KEY: str = get_config("SERVER_SK", "WOWZA")
# alternatively: "postgresql://user:password@postgresserver/db"
DB_URL: str     = get_config("SERVER_DB", "sqlite:///the.db") 


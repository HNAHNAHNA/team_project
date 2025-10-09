import os
from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DB_HOST: str
    DB_PORT: int
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    application_ID: str
    application_Secret: str
    affiliate_ID: str

    SECRET_KEY: str

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore",       # 선언되지 않은 env 변수는 무시하도록,
    )

SPRING_URL = os.getenv("SPRING_BASE_URL")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

settings = Settings()
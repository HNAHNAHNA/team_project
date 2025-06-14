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

    class Config:
        env_file = ".env"

settings = Settings()
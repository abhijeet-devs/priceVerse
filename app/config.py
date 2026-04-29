"""
Application settings loaded from .env
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # PostgreSQL
    POSTGRES_USER: str = "priceverse"
    POSTGRES_PASSWORD: str = "priceverse123"
    POSTGRES_DB: str = "priceverse_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432

    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_TTL_SECONDS: int = 600  # 10 minutes

    # API
    SECRET_KEY: str = "supersecretkey"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True

    # CORS
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    @property
    def DATABASE_URL(self) -> str:
        return "sqlite+aiosqlite:///./priceverse.db"

    @property
    def REDIS_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"


settings = Settings()

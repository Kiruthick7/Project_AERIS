from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel API"
    API_V1_STR: str = "/api/v1"
    
    # Database
    POSTGRES_USER: str = "sentinel_user"
    POSTGRES_PASSWORD: str = "sentinel_password"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "sentinel"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: str = "6379"
    
    # Security
    SECRET_KEY: str = "CHANGE_ME_IN_PRODUCTION_TO_A_SECURE_RANDOM_STRING"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 days
    
    # External APIs
    GEMINI_API_KEY: str = ""
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

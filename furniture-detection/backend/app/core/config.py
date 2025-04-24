from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 应用配置
    PROJECT_NAME: str = "Furniture Detection API"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    
    # 模型配置
    MODEL_PATH: str = "model_weights/yolov8n.pt"
    
    # 文件存储
    UPLOAD_DIR: str = "tmp_uploads"
    MAX_FILE_SIZE_MB: int = 100
    
    # Celery配置
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/1"

    class Config:
        case_sensitive = True

settings = Settings()
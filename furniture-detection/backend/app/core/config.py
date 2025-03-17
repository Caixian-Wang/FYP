from pydantic import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    MODEL_PATH: str = "model_weights/yolov8n.pt"
    UPLOAD_DIR: str = "tmp_uploads"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"

settings = Settings()
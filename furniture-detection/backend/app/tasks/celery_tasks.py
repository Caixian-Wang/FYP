from celery import Celery
from app.core.config import settings
from app.utils.model_service import DetectionService

celery = Celery(__name__)
celery.conf.broker_url = settings.CELERY_BROKER_URL
celery.conf.result_backend = settings.CELERY_RESULT_BACKEND

detector = DetectionService()

@celery.task(bind=True, name="async_video_detection")
def async_video_detection(self, video_path: str):
    self.update_state(state="PROCESSING")
    result = detector.process_video(video_path)
    return {"status": "COMPLETED", "result": [r.dict() for frame in result for r in frame]}
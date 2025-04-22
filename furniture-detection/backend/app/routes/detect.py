from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from app.models.base import DetectionResult, TaskStatus
from app.utils.file_processor import save_upload_file, cleanup_file
from app.tasks.celery_tasks import async_video_detection
from app.models.detector import detector

router = APIRouter()

@router.post("/detect/image", response_model=List[DetectionResult])
async def detect_image(file: UploadFile = File(...)):
    try:
        file_path = await save_upload_file(file)
        detections = detector.detect(file_path)
        return detections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cleanup_file(file_path)

@router.post("/detect/video", response_model=TaskStatus)
async def detect_video(file: UploadFile = File(...)):
    try:
        video_path = await save_upload_file(file)
        task = async_video_detection.delay(video_path)
        return TaskStatus(task_id=task.id, status="PENDING")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
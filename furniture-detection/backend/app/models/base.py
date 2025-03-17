from pydantic import BaseModel
from typing import List, Optional

class DetectionResult(BaseModel):
    class_name: str
    confidence: float
    bbox: List[float]

class VideoDetectionRequest(BaseModel):
    video_path: str
    process_fps: int = 5

class TaskStatus(BaseModel):
    task_id: str
    status: str
    progress: Optional[float] = None
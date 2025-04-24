from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
from app.models.base import DetectionResult, TaskStatus
from app.utils.file_processor import save_upload_file, cleanup_file
from app.tasks.celery_tasks import async_video_detection
from app.models.detector import detector
import logging

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/detect/image")
async def detect_image(file: UploadFile = File(...)) -> Dict[str, Any]:
    file_path = None
    try:
        # 验证文件类型
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        logger.info(f"Processing file: {file.filename}")
        
        # 保存文件
        file_path = await save_upload_file(file)
        logger.info(f"File saved to: {file_path}")
        
        # 运行检测
        detections, annotated_image = detector.detect(file_path)
        logger.info(f"Detection results: {detections}")
        
        response_data = {
            "detections": detections,
            "annotated_image": annotated_image
        }
        logger.info("Detection completed successfully")
        
        return response_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Detection failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")
    finally:
        if file_path:
            cleanup_file(file_path)

@router.post("/detect/video", response_model=TaskStatus)
async def detect_video(file: UploadFile = File(...)):
    file_path = None
    try:
        # 验证文件类型
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # 保存文件
        file_path = await save_upload_file(file)
        
        # TODO: 实现视频检测
        # 目前返回一个模拟的任务状态
        return TaskStatus(
            task_id="mock_task_id",
            status="PENDING",
            progress=0.0
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video detection failed: {str(e)}")
    finally:
        if file_path:
            cleanup_file(file_path)
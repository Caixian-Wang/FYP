from ultralytics import YOLO
import cv2
from typing import List
from app.models.base import DetectionResult

class DetectionService:
    def __init__(self):
        self.model = YOLO("model_weights/yolov8n.pt")
    
    def process_frame(self, frame):
        results = self.model(frame)
        return [
            DetectionResult(
                class_name=results.names[int(box.cls)],
                confidence=float(box.conf),
                bbox=box.xyxy.tolist()[0]
            ) for box in results[0].boxes
        ]
    
    def process_video(self, video_path: str, fps: int = 5) -> List[List[DetectionResult]]:
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        results = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            if frame_count % int(cap.get(cv2.CAP_PROP_FPS)/fps) == 0:
                results.append(self.process_frame(frame))
        
        return results
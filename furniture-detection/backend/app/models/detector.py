from ultralytics import YOLO
import os
from typing import List
from app.models.base import DetectionResult

class FurnitureDetector:
    def __init__(self):
        model_path = os.path.join(os.path.dirname(__file__), '../../model_weights/furniture.pt')
        self.model = YOLO(model_path)
        
    def detect(self, image_path: str) -> List[DetectionResult]:
        results = self.model(image_path)
        detections = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detections.append(DetectionResult(
                    class_name=result.names[int(box.cls[0])],
                    confidence=float(box.conf[0]),
                    bbox=box.xyxy[0].tolist()
                ))
        
        return detections

detector = FurnitureDetector() 
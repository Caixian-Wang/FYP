from ultralytics import YOLO
import os
from typing import List
from app.models.base import DetectionResult

class FurnitureDetector:
    def __init__(self):
        # 更新模型路径
        model_path = os.path.join('D:/FYP/furniture-detection/weights', 'yolo11n.pt')
        
        # 检查模型文件是否存在
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at {model_path}")
        
        # 加载模型
        try:
            self.model = YOLO(model_path)
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
        
    def detect(self, image_path: str) -> List[DetectionResult]:
        try:
            # 运行检测
            results = self.model(image_path)
            detections = []
            
            # 处理检测结果
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    # 获取类别名称
                    class_id = int(box.cls[0])
                    class_name = result.names[class_id]
                    
                    # 获取置信度
                    confidence = float(box.conf[0])
                    
                    # 获取边界框坐标
                    bbox = box.xyxy[0].tolist()
                    
                    # 创建检测结果
                    detections.append(DetectionResult(
                        class_name=class_name,
                        confidence=confidence,
                        bbox=bbox
                    ))
            
            return detections
        except Exception as e:
            print(f"Error during detection: {e}")
            raise

# 创建单例实例
detector = FurnitureDetector() 
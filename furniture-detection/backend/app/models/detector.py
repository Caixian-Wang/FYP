from ultralytics import YOLO
import os
from typing import List, Tuple
import cv2
import numpy as np
from app.models.base import DetectionResult
import base64
import logging

logger = logging.getLogger(__name__)

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
            logger.info(f"Model loaded successfully from {model_path}")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise
    
    def draw_detections(self, image: np.ndarray, detections: List[DetectionResult]) -> np.ndarray:
        """在图像上绘制检测结果"""
        img = image.copy()
        for det in detections:
            # 获取边界框坐标
            x1, y1, x2, y2 = map(int, det.bbox)
            
            # 绘制边界框
            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
            
            # 准备标签文本
            label = f"{det.class_name} {det.confidence:.2f}"
            
            # 计算标签位置
            label_size, baseline = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
            y1 = max(y1, label_size[1])
            
            # 绘制标签背景
            cv2.rectangle(img, (x1, y1 - label_size[1]), (x1 + label_size[0], y1), (0, 255, 0), cv2.FILLED)
            
            # 绘制标签文本
            cv2.putText(img, label, (x1, y1), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1)
        
        return img
        
    def detect(self, image_path: str) -> Tuple[List[DetectionResult], str]:
        try:
            logger.info(f"Starting detection on image: {image_path}")
            
            # 读取原始图像
            original_image = cv2.imread(image_path)
            if original_image is None:
                raise ValueError("Failed to read image")
            
            # 运行检测
            results = self.model(image_path)
            detections = []
            
            # 处理检测结果
            for result in results:
                boxes = result.boxes
                logger.info(f"Found {len(boxes)} objects")
                
                for box in boxes:
                    # 获取类别名称
                    class_id = int(box.cls[0])
                    class_name = result.names[class_id]
                    
                    # 获取置信度
                    confidence = float(box.conf[0])
                    
                    # 获取边界框坐标
                    bbox = box.xyxy[0].tolist()
                    
                    logger.info(f"Detected {class_name} with confidence {confidence:.2f} at {bbox}")
                    
                    # 创建检测结果
                    detections.append(DetectionResult(
                        class_name=class_name,
                        confidence=confidence,
                        bbox=bbox
                    ))
            
            # 在图像上绘制检测结果
            annotated_image = self.draw_detections(original_image, detections)
            
            # 将图像转换为base64字符串
            _, buffer = cv2.imencode('.jpg', annotated_image)
            image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            logger.info(f"Detection completed with {len(detections)} results")
            return detections, f"data:image/jpeg;base64,{image_base64}"
            
        except Exception as e:
            logger.error(f"Error during detection: {e}", exc_info=True)
            raise

# 创建单例实例
detector = FurnitureDetector() 
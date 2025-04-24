import os
import uuid
from fastapi import UploadFile
from typing import Optional

# 创建临时文件目录
TEMP_DIR = "temp_uploads"
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

async def save_upload_file(file: UploadFile) -> str:
    """
    保存上传的文件到临时目录
    """
    try:
        # 生成唯一文件名
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(TEMP_DIR, unique_filename)
        
        # 保存文件
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return file_path
    except Exception as e:
        print(f"Error saving file: {e}")
        raise

def cleanup_file(file_path: Optional[str]) -> None:
    """
    清理临时文件
    """
    try:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Error cleaning up file: {e}")
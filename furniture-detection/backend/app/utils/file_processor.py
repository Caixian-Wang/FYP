import os
import uuid
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings

def ensure_dir(path: str):
    Path(path).mkdir(parents=True, exist_ok=True)

async def save_upload_file(upload_file: UploadFile, custom_dir: str = None) -> str:
    save_dir = custom_dir or settings.UPLOAD_DIR
    ensure_dir(save_dir)
    
    file_ext = upload_file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(save_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        content = await upload_file.read()
        buffer.write(content)
    
    return file_path

def cleanup_file(file_path: str):
    try:
        os.remove(file_path)
    except:
        pass
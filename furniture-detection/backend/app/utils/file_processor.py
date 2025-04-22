import os
import uuid
from fastapi import UploadFile

UPLOAD_DIR = "static/uploads"

async def save_upload_file(file: UploadFile) -> str:
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, file_name)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return file_path

def cleanup_file(file_path: str):
    if os.path.exists(file_path):
        os.remove(file_path)
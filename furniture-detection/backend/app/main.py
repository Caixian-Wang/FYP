from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.routes import detect

app = FastAPI(title=settings.PROJECT_NAME)

# 挂载静态文件（处理 favicon.ico）
app.mount("/static", StaticFiles(directory="static"), name="static")

# 根路径重定向到文档
@app.get("/", include_in_schema=False)
async def root(request: Request):
    return RedirectResponse(url="/docs")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 挂载检测路由
app.include_router(detect.router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
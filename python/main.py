from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import accommodations_insert
from app.routers.accommodationRouter import router as accommodationRouter
from app.routers.jwtValidate import router as jwtvalidate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 개발 중이면 *도 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(accommodations_insert.router)

# 이건 홈화면 호텔들 슬라이드 띄우기
app.include_router(accommodationRouter)
# 이건 jwt 유효성 검사
app.include_router(jwtvalidate)

@app.get("/test")
def test():
    return {"message": "Hello FastAPI"}


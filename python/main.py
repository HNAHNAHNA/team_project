from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import accommodations_insert

app = FastAPI()

app.include_router(accommodations_insert.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 개발 중이면 *도 가능
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    return {"message": "Hello FastAPI"}

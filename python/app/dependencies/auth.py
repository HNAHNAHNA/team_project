from fastapi import Depends, Header, HTTPException
from app.config import Settings, SPRING_URL
import requests

def get_current_user(authorization: str = Header(...)):
    print("🔐 Authorization Header:", authorization)

    url = f"{SPRING_URL}/api/v1/auth/validate"

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="잘못된 인증 헤더 형식입니다.")

    token = authorization.split(" ")[1]

    try:
        res = requests.get(url, headers={"Authorization": f"Bearer {token}"})
        print("📡 Spring 응답:", res.status_code, res.text)

        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail="JWT 검증 실패")

        return res.json()
    except Exception as e:
        print("💥 Spring 통신 실패:", e)
        raise HTTPException(status_code=500, detail=f"Spring 서버 통신 실패: {e}")
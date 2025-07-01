from fastapi import Depends, Header, HTTPException
import requests

SPRING_VALIDATE_URL = "http://spring-backend:8091/api/v1/auth/validate"

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="잘못된 인증 헤더 형식입니다.")

    token = authorization.split(" ")[1]

    try:
        res = requests.get(SPRING_VALIDATE_URL, headers={"Authorization": f"Bearer {token}"})
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail="JWT 검증 실패")

        return res.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spring 서버 통신 실패: {e}")
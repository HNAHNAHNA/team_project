from fastapi import APIRouter, HTTPException, Query
from app.config import Settings, SPRING_URL
import requests

router = APIRouter(prefix="/api/fastapi")

@router.get("/validate")
def validate_jwt_token(token: str = Query(...)) -> dict:
    """
    /auth/validate?token=... 으로 요청 시,
    JWT를 검증하고 payload를 반환합니다..
    """

    url = f"{SPRING_URL}/api/v1/auth/validate"

    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        res = requests.get(url, headers=headers)

        if res.status_code == 200:
            return {"valid": True, "spring_response": res.text}
        else:
            raise HTTPException(status_code=res.status_code, detail=res.text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spring 요청 실패: {e}")

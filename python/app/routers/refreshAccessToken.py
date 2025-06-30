from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import requests

router = APIRouter(prefix="/api/fastapi")
SPRING_REFRESH_URL = 'http://localhost:8091/api/v1/auth/reissue'

class RefreshTokenRequest(BaseModel):
    refreshToken: str

@router.post("/refresh")
def refresh_access_token(request: RefreshTokenRequest) -> dict:
    """
    클라이언트로부터 Refresh Token을 받아 Spring 서버에 토큰 재발급 요청을 보냅니다.
    성공 시 새로운 Access Token과 Refresh Token을 반환합니다.
    """
    refresh_token = request.refreshToken
    try:
        print('토큰 재발급!')
        print('우와앙!')
        response = requests.post(
            SPRING_REFRESH_URL,
            json={"refreshToken": refresh_token},
            headers={"Content-Type": "application/json"}
        )

        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Spring 응답 오류: {response.text}"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spring 서버 요청 실패: {e}")
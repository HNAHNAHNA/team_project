from fastapi import Depends, Header, HTTPException
import requests

SPRING_VALIDATE_URL = "http://localhost:8091/api/v1/auth/validate"

def get_current_user(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="잘못된 인증 헤더 형식입니다.")

    token = authorization.split(" ")[1]

    try:
        res = requests.get(SPRING_VALIDATE_URL, headers={"Authorization": f"Bearer {token}"})
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail="JWT 검증 실패")
        try:
            spring_data = res.json()
        except ValueError:
            raise HTTPException(status_code=500, detail=f"Spring 응답이 JSON이 아님: {res.text}")

        # 예: Spring 서버가 {"user_id":1, "email":"xxx", "role":"USER"} 형태로 응답하면
        print("🔍 Spring 응답 원문:", res.text)
        return res.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Spring 서버와 통신 실패: {e}")
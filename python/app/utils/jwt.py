from base64 import b64decode
from datetime import datetime
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import Settings
from app.database.connection import get_db
from app.models.users import User as UserModel
from app.schemas.users import UsersOut as UserSchema, TokenPayload

settings = Settings()

# Base64로 저장된 시크릿을 실제 문자열로 복원
SECRET_KEY = settings.JWT_SECRET_KEY_BASE64
ALGORITHM = "HS256"

# Swagger/OpenAPI에서 password 흐름용 토큰 URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def verify_token(token: str) -> TokenPayload:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
            options={"require": ["sub", "exp"]},
        )
        print("✅ JWT payload:", payload)
        return TokenPayload(**payload)

    except JWTError as e:
        # 어떤 에러인지 반드시 찍어봅니다.
        print("❌ JWT decode error:", repr(e))
        raise credentials_exc


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> UserSchema:
    """
    Depends로 사용해서, 보호된 엔드포인트에 들어올 때마다
    1) 토큰 검증 → TokenPayload 반환
    2) DB에서 sub(email)로 User 조회
    3) UsersOut 스키마 인스턴스 반환
    """
    token_data = verify_token(token)

    user: Optional[UserModel] = (
        db.query(UserModel)
        .filter(UserModel.u_email == token_data.sub)
        .first()
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserSchema.from_orm(user)
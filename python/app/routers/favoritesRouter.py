import traceback
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.favorites import Favorite
from app.schemas.favorites import FavoriteCreate, FavoriteOut

router = APIRouter()

@router.post("/api/v1/favorites", response_model=FavoriteOut)
def create_favorite(fav: FavoriteCreate, db: Session = Depends(get_db)):
    try:
        new_fav = Favorite(
            user_id=fav.user_id,
            accommodation_id=fav.accommodation_id
        )
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        return new_fav
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"찜 등록 중 오류 발생: {e}")
    
@router.get("/api/v1/favorites/user/{user_id}", response_model=List[FavoriteOut])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    try:
        favorites = db.query(Favorite).filter_by(user_id=user_id).all()
        return favorites
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"찜 목록 조회 중 오류 발생: {e}")

@router.delete("/api/v1/favorites/delete")
def delete_favorite(
    user_id: int = Query(..., description="유저 ID"),
    accommodation_id: int = Query(..., description="숙소 ID"),
    db: Session = Depends(get_db)
):
    try:
        fav = db.query(Favorite).filter_by(user_id=user_id, accommodation_id=accommodation_id).first()
        if not fav:
            raise HTTPException(status_code=404, detail="찜 기록을 찾을 수 없습니다.")
        
        db.delete(fav)
        db.commit()
        return {"message": "찜이 성공적으로 삭제되었습니다."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"찜 삭제 중 오류 발생: {e}")
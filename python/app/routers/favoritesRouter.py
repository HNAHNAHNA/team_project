import traceback
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session, joinedload
from app.database.connection import get_db
from app.models.accommodation import Accommodation
from app.models.favorites import Favorite
from app.schemas.favorites import FavoriteCreate, FavoriteOut

router = APIRouter(prefix="/api/fastapi")

@router.post("/favorites", response_model=FavoriteOut)
def create_favorite(fav: FavoriteCreate, db: Session = Depends(get_db)):
    try:
        new_fav = Favorite(
            user_id=fav.user_id,
            accommodation_id=fav.accommodation_id
        )
        db.add(new_fav)
        db.commit()
        db.refresh(new_fav)
        print("찜목록 추가 완료")
        
        return new_fav
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"찜 등록 중 오류 발생: {e}")
    
@router.get("/favorites/user/{user_id}", response_model=List[FavoriteOut])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    try:
        favorites = db.query(Favorite).filter_by(user_id=user_id).all()
        return favorites
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"찜 목록 조회 중 오류 발생: {e}")

@router.delete("/favorites/delete")
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
        return {"message": "찜이 성공적으로 삭제되었습니다!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"찜 삭제 중 오류 발생: {e}")
    
@router.get("/favorites/{user_id}", response_model=list[FavoriteOut])
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .options(joinedload(Favorite.accommodation))
        .all()
    )
    return favorites

class HotelNoResponse(BaseModel):
    hotel_no: int

@router.get("/favorites/hotel-no", response_model=HotelNoResponse)
def get_hotel_number(
    accommodation_id: int = Query(..., description="숙소 ID"),
    db: Session = Depends(get_db)
):
    try:
        accommodation = db.query(Accommodation).filter_by(accommodation_id=accommodation_id).first()

        if not accommodation:
            raise HTTPException(status_code=404, detail="해당 숙소를 찾을 수 없습니다.")

        return {"hotel_no": accommodation.hotel_no}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"호텔 번호 조회 중 오류 발생: {e}")
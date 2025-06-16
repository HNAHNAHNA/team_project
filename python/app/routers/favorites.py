from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.favorites import Favorite as FavoriteModel
from app.schemas.favorites import favoritesOut as FavoriteOut, FavoriteCreate

router = APIRouter(
    prefix="/api/v1/favorites",
    tags=["Favorites"],
)

@router.post(
    "",
    response_model=FavoriteOut,
    status_code=status.HTTP_201_CREATED,
)
def add_favorite(
    user_id: int = Query(..., description="즐겨찾기 추가할 사용자 ID"),
    favorite_data: FavoriteCreate = Depends(),
    db: Session = Depends(get_db),
) -> FavoriteModel:
    """
    user_id는 쿼리로, accommodation_id는 바디로 받아서 favorites 테이블에 저장합니다.
    """
    # 중복 체크
    if (
        db.query(FavoriteModel)
        .filter_by(user_id=user_id, accommodation_id=favorite_data.accommodation_id)
        .first()
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 즐겨찾기에 추가된 숙소입니다.",
        )

    new_fav = FavoriteModel(
        user_id=user_id,
        accommodation_id=favorite_data.accommodation_id,
    )
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav


@router.get(
    "",
    response_model=List[FavoriteOut],
)
def get_user_favorites(
    user_id: int = Query(..., description="조회할 사용자 ID"),
    db: Session = Depends(get_db),
) -> List[FavoriteModel]:
    """
    해당 user_id의 즐겨찾기 리스트를 반환합니다.
    """
    return (
        db.query(FavoriteModel)
        .filter_by(user_id=user_id)
        .all()
    )


@router.delete(
    "/{accommodation_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
def remove_favorite(
    accommodation_id: int,
    user_id: int = Query(..., description="삭제할 사용자 ID"),
    db: Session = Depends(get_db),
) -> None:
    """
    해당 user_id의 favorites에서 accommodation_id를 삭제합니다.
    """
    fav = (
        db.query(FavoriteModel)
        .filter_by(user_id=user_id, accommodation_id=accommodation_id)
        .first()
    )
    if not fav:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="삭제할 즐겨찾기를 찾을 수 없습니다.",
        )
    db.delete(fav)
    db.commit()
    return None


@router.get(
    "/check/{accommodation_id}",
    response_model=bool,
)
def check_favorite_status(
    accommodation_id: int,
    user_id: int = Query(..., description="확인할 사용자 ID"),
    db: Session = Depends(get_db),
) -> bool:
    """
    해당 user_id의 즐겨찾기에 accommodation_id가 있는지 여부를 반환합니다.
    """
    exists = (
        db.query(FavoriteModel)
        .filter_by(user_id=user_id, accommodation_id=accommodation_id)
        .first()
    )
    return bool(exists)
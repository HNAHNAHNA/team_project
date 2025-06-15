from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.accommodation import Accommodation
from app.schemas.accommodation import AccommodationOut
from typing import List

router = APIRouter()

@router.get("/accommodations", response_model=List[AccommodationOut])
def get_all_accommodations(db: Session = Depends(get_db)):
    return db.query(Accommodation).all()
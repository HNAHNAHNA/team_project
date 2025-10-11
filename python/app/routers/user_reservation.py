from typing import List
from fastapi import APIRouter, Body, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.dependencies.auth import get_current_user
from app.models.accommodation import Accommodation 
from app.models.user_reservations import UserReservation
from app.schemas.accommodation import AccommodationOut
from app.schemas.user_reservations import ReservationRequest, ReservationResponse, UserReservationOUT
from app.utils.generate_booking_id import generate_booking_id

router = APIRouter(prefix="/api/fastapi")

@router.post("/reservations", response_model=ReservationResponse)
def create_reservation(
    data: ReservationRequest,
    db: Session = Depends(get_db)
):
    if data.check_out_date <= data.check_in_date:
        raise HTTPException(status_code=400, detail="체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.")

    # 중복 예약 검사!!!
    overlapping_reservation = db.query(UserReservation).filter(
        UserReservation.hotel_id == data.hotel_id,
        UserReservation.check_out_date > data.check_in_date,
        UserReservation.check_in_date < data.check_out_date
    ).first()

    if overlapping_reservation:
        raise HTTPException(status_code=400, detail="해당 날짜에는 이미 예약이 존재합니다.")

    # 예약 생성
    new_reservation = UserReservation(
        u_booking_id=generate_booking_id(),
        hotel_id=data.hotel_id,
        check_in_date=data.check_in_date,
        check_out_date=data.check_out_date,
        user_id=data.user_id
    )

    db.add(new_reservation)
    db.commit()
    db.refresh(new_reservation)

    return {
        "reservation_id": new_reservation.reservation_id,
        "message": "예약이 완료되었습니다."
    }

@router.get("/get-hotel-id")
def get_hotel_id(hotelNo: int = Query(...), db: Session = Depends(get_db)):
    print(f" hotelNo 요청 들어옴: {hotelNo}")
    hotel = db.query(Accommodation).filter(Accommodation.hotel_no == hotelNo).first()
    if not hotel:
        print(" hotel 정보 없음")
        raise HTTPException(status_code=404, detail="해당 hotelNo에 대한 호텔을 찾을 수 없습니다.")
    print(f" hotel_id = {hotel.accommodation_id}")
    return { "hotel_id": hotel.accommodation_id }

@router.get("/get-user-reservation-data", response_model = List[UserReservationOUT])
def get_reservation_data(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    print(" current_user:", current_user)
    user_id = current_user["user_id"]
    print(" user_id:", user_id)

    reservations = (
        db.query(UserReservation)
        .join(Accommodation)
        .filter(UserReservation.user_id == user_id)
        .all()
    )

    return reservations

@router.get("/get-hotel-location", response_model = AccommodationOut)
def get_hotel_location (accommodation_id: int = Header(...), db: Session = Depends(get_db)):
    print("request!")

    accommodation = (
        db.query(Accommodation)
        .filter(Accommodation.accommodation_id == accommodation_id)
        .first()
        )
    
    if not accommodation:
        raise HTTPException(status_code=404, detail="accommodation NOT FOUND!")
    return accommodation

@router.delete("/delete-reservation")
def delete_reservation(
    user_id: int = Body(...),
    accommodation_id: int = Body(...),
    check_in_date: str = Body(...),  # YYYY-MM-DD
    db: Session = Depends(get_db)
):
    reservation = (
        db.query(UserReservation)
        .filter(
            UserReservation.user_id == user_id,
            UserReservation.hotel_id == accommodation_id,
            UserReservation.check_in_date == check_in_date  # 정확한 예약
        )
        .first()
    )

    print(reservation)

    if not reservation:
        raise HTTPException(status_code=404, detail="해당 예약을 찾을 수 없습니다!")

    db.delete(reservation)
    db.commit()

    return {"message": "예약이 성공적으로 삭제되었습니다."}
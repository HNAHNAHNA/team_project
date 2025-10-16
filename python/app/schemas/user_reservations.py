from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional
from app.schemas.accommodation import AccommodationOut
from app.schemas.payments import PaymentStatus

class UserReservationOUT(BaseModel):
    reservation_id: int
    u_booking_id: int
    hotel_id: int
    reserved_at: datetime 
    check_in_date: date
    check_out_date: date
    user_id: int
    status: str
    accommodation: AccommodationOut
    payment_status: Optional[PaymentStatus] = None

class ReservationRequest(BaseModel):
    user_id: int
    hotel_id: int
    check_in_date: str
    check_out_date: str

class ReservationResponse(BaseModel):
    reservation_id: int
    message: str

    class Config:
        orm_mode = True 
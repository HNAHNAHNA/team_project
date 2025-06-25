from pydantic import BaseModel
from datetime import datetime
from app.schemas.accommodation import AccommodationOut

class UserReservationOUT(BaseModel):
    reservation_id: int
    u_booking_id: int
    hotel_id: int
    reserved_at: datetime 
    check_in_date: str
    check_out_date: str
    user_id: int
    hotel: AccommodationOut

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
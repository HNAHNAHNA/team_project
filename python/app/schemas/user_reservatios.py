from pydantic import BaseModel
from datetime import datetime
class UserReservationOUT(BaseModel):
    reservation_id: int
    u_booking_id: int
    hotel_id: int
    reserved_at: datetime 
    check_in_date: str
    check_out_date: str
    user_id: int

    class Config:
        orm_mode = True 
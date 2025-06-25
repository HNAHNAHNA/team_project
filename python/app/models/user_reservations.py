from sqlalchemy import Column, Integer, BigInteger, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base


class UserReservation(Base):
    __tablename__ = "user_reservations"

    reservation_id = Column(Integer, primary_key=True, autoincrement=True)
    u_booking_id = Column(Integer, nullable=False)
    hotel_id = Column(Integer, ForeignKey("accommodations.accommodation_id"), nullable=False)
    reserved_at = Column(DateTime, default=func.now())
    check_in_date = Column(String(20))
    check_out_date = Column(String(20))
    user_id = Column(BigInteger, ForeignKey("users.u_user_id"), nullable=False)

from sqlalchemy import Column, Integer, BigInteger, DateTime, String, ForeignKey
from sqlalchemy.sql import func
from app.database.connection import Base

class UserReservation(Base):
    __tablename__ = 'user_reservations'

    reservation_id = Column(Integer, primary_key=True, autoincrement=True) 
    u_booking_id = Column(Integer, nullable=False)
    hotel_id = Column(Integer, ForeignKey('accommodations.id'), nullable=False)
    reserved_at = Column(DateTime, nullable=True, default=func.now())
    
    check_in_date = Column(String(20), nullable=True)
    check_out_date = Column(String(20), nullable=True)
    
    user_id = Column(BigInteger, ForeignKey('users.u_user_id'), nullable=False)

    def __repr__(self):
        return f"<UserReservation(reservation_id={self.reservation_id}, user_id={self.user_id}, hotel_id={self.hotel_id})>"
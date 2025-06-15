from sqlalchemy import Column, Integer, BigInteger, Float, Text, DateTime, ForeignKey, func
from app.database.connection import Base

class AccommodationReview(Base):
    __tablename__ = 'accommodations_reviews'

    review_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.u_user_id'), nullable=False)
    accommodation_id = Column(Integer, ForeignKey('accommodations.id'), nullable=False)
    rating = Column(Float, nullable=True)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp())
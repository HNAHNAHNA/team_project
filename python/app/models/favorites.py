from sqlalchemy import Column, Integer, BigInteger, DateTime, ForeignKey, func
from app.database.connection import Base


class Favorite(Base):
    __tablename__ = 'favorites'

    favorite_id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.u_user_id'), nullable=False)
    accommodation_id = Column(Integer, ForeignKey('accommodations.id'), nullable=False)
    created_at = Column(DateTime, nullable=True, server_default=func.current_timestamp())
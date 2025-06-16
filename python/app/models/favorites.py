from sqlalchemy import BigInteger, Integer, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database.connection import Base
from datetime import datetime

class Favorite(Base):
    __tablename__ = "favorites"
    __table_args__ = (
    UniqueConstraint('user_id', 'accommodation_id', name='uix_user_accommodation'),
)


    favorite_id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.u_user_id"), nullable=False)
    accommodation_id: Mapped[int] = mapped_column(Integer, ForeignKey("accommodations.accommodation_id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
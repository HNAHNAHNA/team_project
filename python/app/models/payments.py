from sqlalchemy import Column, Integer, BigInteger, DECIMAL, String, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.database.connection import Base
from datetime import datetime
from enum import Enum as PyEnum

class PaymentMethod(PyEnum):
    CARD = 'CARD'
    BANK_TRANSFER = 'BANK_TRANSFER'
    KAKAOPAY = 'KAKAOPAY'
    NAVERPAY = 'NAVERPAY'

class PaymentStatus(PyEnum):
    PENDING = 'PENDING'
    COMPLETED = 'COMPLETED'
    FAILED = 'FAILED'
    CANCELLED = 'CANCELLED'

class Payment(Base):
    __tablename__ = 'payments'

    payment_id = Column(BigInteger, primary_key=True, autoincrement=True)
    reservation_id = Column(Integer, ForeignKey('user_reservations.reservation_id'), nullable=False)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False) 
    status = Column(Enum(PaymentStatus), nullable=True, default=PaymentStatus.PENDING)
    paid_at = Column(DateTime, nullable=True, default=func.now()) 

    def __repr__(self):
        return f"<Payment(payment_id={self.payment_id}, user_id={self.user_id}, amount={self.amount}, status={self.status})>"
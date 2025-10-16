from sqlalchemy import Column, BigInteger, String, Enum, DateTime, Integer, func
from app.database.connection import Base
import enum

class UserRole(enum.Enum):
    GUEST = 'GUEST'
    HOST = 'HOST'
    ADMIN = 'ADMIN'

class UserStatus(enum.Enum):
    ACTIVE = 'ACTIVE'
    INACTIVE = 'INACTIVE'
    DELETED = 'DELETED'

class User(Base):
    __tablename__ = "users"

    u_user_id = Column(BigInteger, primary_key=True, autoincrement=True)
    u_email = Column(String(100), nullable=False, unique=True)
    u_password_hash = Column(String(255), nullable=False)
    u_username = Column(String(50), nullable=False)
    u_phone_number = Column(String(30), unique=True)
    u_zipcode = Column(String(20))
    u_address_main = Column(String(255))
    u_address_detail = Column(String(255))
    u_role = Column(Enum(UserRole), default=UserRole.GUEST, nullable=False)
    u_status = Column(Enum(UserStatus), default=UserStatus.ACTIVE, nullable=False)
    u_refresh_token = Column(String(500), unique=True)
    u_token_expiry_date = Column(DateTime)
    u_created_at = Column(DateTime, server_default=func.now(), nullable=False)
    u_updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
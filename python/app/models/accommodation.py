# +------------------+---------------+------+-----+-------------------+-------------------+
# | Field            | Type          | Null | Key | Default           | Extra             |
# +------------------+---------------+------+-----+-------------------+-------------------+
# | accommodation_id | int           | NO   | PRI | NULL              | auto_increment    |
# | name             | varchar(255)  | NO   |     | NULL              |                   |
# | address          | varchar(255)  | YES  |     | NULL              |                   |
# | description      | text          | YES  |     | NULL              |                   |
# | image_url        | varchar(2083) | YES  |     | NULL              |                   |
# | created_at       | datetime      | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
# | host_user_id     | bigint        | YES  | MUL | NULL              |                   |
# +------------------+---------------+------+-----+-------------------+-------------------+

from sqlalchemy import Column, Double, Float, Integer, String, Text, DateTime, ForeignKey, BigInteger, func
from app.database.connection import Base

class Accommodation(Base):
    __tablename__ = "accommodations"

    accommodation_id = Column(Integer, primary_key=True, autoincrement=True)
    host_user_id = Column(BigInteger, nullable=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(2083), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    charge = Column(Integer, nullable=False)
    latitude = Column(Double, nullable=False)
    longitude = Column(Double, nullable=False)
    review_count = Column(Integer, nullable=True)
    review_average = Column(Float, nullable=True)
    checkin_time = Column(String(5), nullable=False)
    checkout_time = Column(String(5), nullable=False)
    telephone = Column(String(20), nullable=True)
    hotel_no = Column(Integer, nullable=False)
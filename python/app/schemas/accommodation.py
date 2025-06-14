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
from pydantic import BaseModel
from datetime import datetime

class AccommodationOut(BaseModel):
    id: int
    host_id: int
    name: str
    address: str | None = None
    description: str | None = None
    image_url: str | None = None
    created_at: datetime | None = None
    host_user_id: int | None = None
    charge: int
    latitude : float
    longitude : float
    review_count : int | None = None
    review_average : float | None = None
    checkin_time : str
    checkout_time : str
    telephone : str | None = None
    hotel_no : int

    class Config:
        orm_mode = True

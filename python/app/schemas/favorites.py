# +------------------+----------+------+-----+-------------------+-------------------+
# | Field            | Type     | Null | Key | Default           | Extra             |
# +------------------+----------+------+-----+-------------------+-------------------+
# | favorite_id      | bigint   | NO   | PRI | NULL              | auto_increment    |
# | user_id          | bigint   | NO   | MUL | NULL              |                   |
# | accommodation_id | int      | NO   | MUL | NULL              |                   |
# | created_at       | datetime | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
# +------------------+----------+------+-----+-------------------+-------------------+
from pydantic import BaseModel
from datetime import datetime

class FavoriteCreate(BaseModel):
    user_id: int
    accommodation_id: int

class FavoriteOut(BaseModel):
    favorite_id: int
    user_id: int
    accommodation_id: int
    created_at: datetime

    class Config:
        from_attributes = True
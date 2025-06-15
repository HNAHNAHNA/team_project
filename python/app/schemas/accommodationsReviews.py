# +-------------------+----------+------+-----+-------------------+-------------------+
# | Field             | Type     | Null | Key | Default           | Extra             |
# +-------------------+----------+------+-----+-------------------+-------------------+
# | review_id         | bigint   | NO   | PRI | NULL              | auto_increment    |
# | user_id           | bigint   | NO   | MUL | NULL              |                   |
# | accommodation_id  | int      | YES  | MUL | NULL              |                   |
# | recommendation_id | bigint   | YES  | MUL | NULL              |                   |
# | rating            | int      | YES  |     | NULL              |                   |
# | content           | text     | YES  |     | NULL              |                   |
# | created_at        | datetime | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
# +-------------------+----------+------+-----+-------------------+-------------------+
from pydantic import BaseModel
from datetime import datetime

class accommodationsReviewsOUT (BaseModel):
    review_id: int
    user_id: int
    accommodation_id: int
    rating: float
    content: str
    created_at: datetime
    
    class config:
        orm_mode = True
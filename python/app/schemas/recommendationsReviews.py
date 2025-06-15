from pydantic import BaseModel
from datetime import datetime

class recommendationsReviewsOUT (BaseModel):
    review_id: int
    user_id: int
    recommendations_id: int
    rating: float
    content: str
    created_at: datetime

    class config:
        orm_mode = True
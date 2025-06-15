from sqlalchemy import Column, Integer, BigInteger, Float, String, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from datetime import datetime
from app.database.connection import Base 

class RecommendationsReviews(Base):
    __tablename__ = 'recommendations_reviews'

    review_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.user_id'), nullable=False)
    recommendation_id = Column(BigInteger, ForeignKey('recommendation.id'), nullable=False) 
    rating = Column(Float, nullable=True)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=True)

    def __repr__(self):
        return f"<RecommendationsReviews(review_id={self.review_id}, user_id={self.user_id}, recommendation_id={self.recommendation_id}, rating={self.rating})>"
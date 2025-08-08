from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True)
    username = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    createdAt = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    likesCount = Column(Integer, nullable=False, default=0)
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(String, primary_key=True)
    postId = Column(String, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    username = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    createdAt = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, nullable=False, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    post = relationship("Post", back_populates="comments")

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    postId = Column(String, ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    username = Column(String, nullable=False)
    __table_args__ = (UniqueConstraint('postId', 'username', name='_post_user_uc'),)

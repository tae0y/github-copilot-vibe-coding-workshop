from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Comment(BaseModel):
    id: str
    postId: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    model_config = {"from_attributes": True}

class Post(BaseModel):
    id: str
    username: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    comments: Optional[List[Comment]] = []
    likesCount: int
    model_config = {"from_attributes": True}

class PostCreateRequest(BaseModel):
    username: str
    content: str

class PostUpdateRequest(BaseModel):
    username: str
    content: str

class CommentCreateRequest(BaseModel):
    username: str
    content: str

class CommentUpdateRequest(BaseModel):
    username: str
    content: str

class LikeRequest(BaseModel):
    username: str
    model_config = {"from_attributes": True}

class Error(BaseModel):
    message: str

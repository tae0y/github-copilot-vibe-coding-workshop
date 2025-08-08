import os
import datetime
import yaml
from fastapi import FastAPI, Depends, HTTPException, status, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.responses import HTMLResponse

from database import init_db, SessionLocal
from models import Post as PostModel, Comment as CommentModel, Like as LikeModel
from schemas import Post, PostCreateRequest, PostUpdateRequest, Comment, CommentCreateRequest, CommentUpdateRequest, LikeRequest, Error
from sqlalchemy.orm import Session
import uuid
from typing import List, Optional


# FastAPI 앱 생성 (기본 docs, redoc 비활성화)
app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url="/openapi.json",
    title="Simple Social Media API",
)

# CORS 전체 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 커스텀 openapi 적용 (openapi.yaml 그대로 반환)
openapi_schema = None
def custom_openapi():
    global openapi_schema
    if openapi_schema is None:
        openapi_schema = load_openapi_yaml()
    return openapi_schema
app.openapi = custom_openapi

# 앱 시작 시 DB 항상 초기화
@app.on_event("startup")
def on_startup():
    init_db()

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------- 게시물(Posts) 엔드포인트 --------------------
# 게시물 목록 조회
@app.get("/posts", response_model=List[Post], tags=["Posts"])
def list_posts(db: Session = Depends(get_db)):
    posts = db.query(PostModel).all()
    result = []
    for post in posts:
        comments = db.query(CommentModel).filter(CommentModel.postId == post.id).all()
        post_data = Post.from_orm(post).dict()
        post_data["comments"] = [CommentModel.__table__.columns.keys() for c in comments]  # dummy, will fix
        result.append(Post(**post_data))
    return result

# 게시물 생성
@app.post("/posts", response_model=Post, status_code=201, tags=["Posts"])
def create_post(req: PostCreateRequest, db: Session = Depends(get_db)):
    post_id = str(uuid.uuid4())
    now = db.bind.dialect.default_schema_name  # dummy, will fix
    post = PostModel(
        id=post_id,
        username=req.username,
        content=req.content,
        createdAt=datetime.datetime.utcnow(),
        updatedAt=datetime.datetime.utcnow(),
        likesCount=0
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return Post(
        id=post.id,
        username=post.username,
        content=post.content,
        createdAt=post.createdAt,
        updatedAt=post.updatedAt,
        comments=[],
        likesCount=post.likesCount
    )

# 단일 게시물 조회
@app.get("/posts/{postId}", response_model=Post, tags=["Posts"])
def get_post(postId: str = Path(...), db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    comments = db.query(CommentModel).filter(CommentModel.postId == post.id).all()
    return Post(
        id=post.id,
        username=post.username,
        content=post.content,
        createdAt=post.createdAt,
        updatedAt=post.updatedAt,
        comments=[],  # 추후 구현
        likesCount=post.likesCount
    )

# 게시물 업데이트
@app.patch("/posts/{postId}", response_model=Post, tags=["Posts"])
def update_post(postId: str, req: PostUpdateRequest, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    post.username = req.username
    post.content = req.content
    post.updatedAt = datetime.datetime.utcnow()
    db.commit()
    db.refresh(post)
    return Post(
        id=post.id,
        username=post.username,
        content=post.content,
        createdAt=post.createdAt,
        updatedAt=post.updatedAt,
        comments=[],  # 추후 구현
        likesCount=post.likesCount
    )

# 게시물 삭제
@app.delete("/posts/{postId}", status_code=204, tags=["Posts"])
def delete_post(postId: str, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    db.delete(post)
    db.commit()
    return None

# -------------------- 댓글(Comments) 엔드포인트 --------------------
# 게시물의 댓글 목록 조회
@app.get("/posts/{postId}/comments", response_model=List[Comment], tags=["Comments"])
def list_comments(postId: str, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    comments = db.query(CommentModel).filter(CommentModel.postId == postId).all()
    return [Comment(
        id=c.id,
        postId=c.postId,
        username=c.username,
        content=c.content,
        createdAt=c.createdAt,
        updatedAt=c.updatedAt
    ) for c in comments]

# 댓글 생성
@app.post("/posts/{postId}/comments", response_model=Comment, status_code=201, tags=["Comments"])
def create_comment(postId: str, req: CommentCreateRequest, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    comment_id = str(uuid.uuid4())
    comment = CommentModel(
        id=comment_id,
        postId=postId,
        username=req.username,
        content=req.content,
        createdAt=datetime.datetime.utcnow(),
        updatedAt=datetime.datetime.utcnow()
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return Comment(
        id=comment.id,
        postId=comment.postId,
        username=comment.username,
        content=comment.content,
        createdAt=comment.createdAt,
        updatedAt=comment.updatedAt
    )

# 특정 댓글 조회
@app.get("/posts/{postId}/comments/{commentId}", response_model=Comment, tags=["Comments"])
def get_comment(postId: str, commentId: str, db: Session = Depends(get_db)):
    comment = db.query(CommentModel).filter(CommentModel.id == commentId, CommentModel.postId == postId).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다.")
    return Comment(
        id=comment.id,
        postId=comment.postId,
        username=comment.username,
        content=comment.content,
        createdAt=comment.createdAt,
        updatedAt=comment.updatedAt
    )

# 댓글 업데이트
@app.patch("/posts/{postId}/comments/{commentId}", response_model=Comment, tags=["Comments"])
def update_comment(postId: str, commentId: str, req: CommentUpdateRequest, db: Session = Depends(get_db)):
    comment = db.query(CommentModel).filter(CommentModel.id == commentId, CommentModel.postId == postId).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다.")
    comment.username = req.username
    comment.content = req.content
    comment.updatedAt = datetime.datetime.utcnow()
    db.commit()
    db.refresh(comment)
    return Comment(
        id=comment.id,
        postId=comment.postId,
        username=comment.username,
        content=comment.content,
        createdAt=comment.createdAt,
        updatedAt=comment.updatedAt
    )

# 댓글 삭제
@app.delete("/posts/{postId}/comments/{commentId}", status_code=204, tags=["Comments"])
def delete_comment(postId: str, commentId: str, db: Session = Depends(get_db)):
    comment = db.query(CommentModel).filter(CommentModel.id == commentId, CommentModel.postId == postId).first()
    if not comment:
        raise HTTPException(status_code=404, detail="댓글을 찾을 수 없습니다.")
    db.delete(comment)
    db.commit()
    return None

# -------------------- 좋아요(Likes) 엔드포인트 --------------------
# 게시물 좋아요
@app.post("/posts/{postId}/likes", status_code=201, tags=["Likes"])
def like_post(postId: str, req: LikeRequest, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    # 이미 좋아요한 경우 400
    exists = db.query(LikeModel).filter(LikeModel.postId == postId, LikeModel.username == req.username).first()
    if exists:
        raise HTTPException(status_code=400, detail="이미 좋아요를 누른 사용자입니다.")
    like = LikeModel(postId=postId, username=req.username)
    db.add(like)
    post.likesCount += 1
    db.commit()
    return {"message": "좋아요 성공"}

# 게시물 좋아요 취소
@app.delete("/posts/{postId}/likes", status_code=204, tags=["Likes"])
def unlike_post(postId: str, req: LikeRequest, db: Session = Depends(get_db)):
    post = db.query(PostModel).filter(PostModel.id == postId).first()
    if not post:
        raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
    like = db.query(LikeModel).filter(LikeModel.postId == postId, LikeModel.username == req.username).first()
    if not like:
        raise HTTPException(status_code=404, detail="좋아요를 찾을 수 없습니다.")
    db.delete(like)
    post.likesCount = max(0, post.likesCount - 1)
    db.commit()
    return None

# openapi.yaml 경로
OPENAPI_YAML_PATH = os.path.join(os.path.dirname(__file__), "../openapi.yaml")

# openapi.yaml 파싱
def load_openapi_yaml():
    with open(OPENAPI_YAML_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


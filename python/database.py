import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

DB_PATH = os.path.join(os.path.dirname(__file__), "sns_api.db")
DB_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DB_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # DB 파일 삭제 후 재생성 (항상 초기화)
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    Base.metadata.create_all(bind=engine)

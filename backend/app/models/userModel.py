from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String, unique=True, index=True)

    password = Column(String)

    full_name = Column(String, nullable=False)

    phone = Column(String, nullable=False)

    store_name = Column(String, nullable=False)

    is_seller = Column(Boolean, default=True)
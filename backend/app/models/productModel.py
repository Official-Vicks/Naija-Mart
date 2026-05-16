from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)

    name = Column(String, nullable=False)

    description = Column(String, nullable=False)

    price = Column(Float, nullable=False)

    stock = Column(Integer, nullable=False)

    category = Column(String, nullable=False)

    images = Column(JSON, nullable=False)

    owner_id = Column(Integer, ForeignKey("users.id"))
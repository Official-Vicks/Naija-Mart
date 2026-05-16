from pydantic import BaseModel
from typing import List

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str
    images: List[str]


class ProductResponse(ProductCreate):
    id: int
    seller: dict

    class Config:
        from_attributes = True
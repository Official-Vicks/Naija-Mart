from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    store_name: str
    phone: str

class UserResponse(BaseModel):
    id: str
    email: str
    password: str
    is_seller: bool
    full_name: str
    store_name: str
    phone: str
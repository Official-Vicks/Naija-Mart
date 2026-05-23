from pydantic import BaseModel, field_validator

class UserCreate(BaseModel):
    email: str
    full_name: str
    store_name: str
    phone: str
    password: str

    @field_validator("password")
    def validate_password(cls, v):
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password too long")
        return v

class UserResponse(BaseModel):
    id: str
    email: str
    password: str
    is_seller: bool
    full_name: str
    store_name: str
    phone: str
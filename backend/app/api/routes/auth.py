from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.models.userModel import User
from app.core.security import hash_password, verify_password, create_access_token
from app.db.session import get_db
from app.schemas.userSchemas import UserCreate

router = APIRouter(prefix="/auth")



@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if len(user.password) <6:
        raise HTTPException(status_code=400, detail="Password must be 6 characters and above")
    
    new_user = User(
        email=user.email,
        password=hash_password(user.password),
        full_name=user.full_name,
        store_name=user.store_name,
        phone=user.phone
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created"}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    is_valid = verify_password(form_data.password, user.password)

    if not is_valid:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    print(form_data.password)
    print(len(form_data.password))
    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone
        }
    }
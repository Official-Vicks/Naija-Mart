from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.productModel import Product
from app.models.userModel import User
from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.productSchemas import ProductCreate

router = APIRouter(prefix="/products")


@router.post("/")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_product = Product(
        **product.model_dump(),
        owner_id=current_user.id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return {
        "id": new_product.id,
        "name": new_product.name,
        "price": new_product.price,
        "stock": new_product.stock,
        "category": new_product.category,
        "description": new_product.description,
        "images": new_product.images,
        "seller": {
            "name": current_user.full_name,
            "phone": current_user.phone
        }
    }

@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    products = db.query(Product).all()

    result = []

    for p in products:
        seller = db.query(User).filter(User.id == p.owner_id).first()

        result.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock": p.stock,
            "category": p.category,
            "description": p.description,
            "images": p.images,
            "seller": {
                "name": seller.full_name,
                "phone": seller.phone
            }
        })

    return result

@router.get("/seller")
def get_products_for_seller(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not current_user.is_seller:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You need to register as a seller/business owner"
        )

    products = db.query(Product).filter(
        Product.owner_id == current_user.id
    ).all()

    results = []

    for p in products:
        results.append({
            "id": p.id,
            "name": p.name,
            "price": p.price,
            "stock": p.stock,
            "category": p.category,
            "description": p.description,
            "images": p.images,
            "seller": {
                "name": current_user.full_name,
                "phone": current_user.phone
            }
        })

    return results
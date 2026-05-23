from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth, products


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    conn = engine.connect()
    print("Database connected successfully")
    conn.close()
except Exception as e:
    print("DB Error:", e)

@app.get("/")
def home():
    return {"message": "NaijaMart API is live"}


app.include_router(auth.router)
app.include_router(products.router)
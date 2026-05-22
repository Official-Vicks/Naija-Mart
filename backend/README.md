# NaijaMart Backend

NaijaMart Backend is a production-style FastAPI backend powering the NaijaMart marketplace platform.

It provides:
- JWT Authentication
- Seller product management
- PostgreSQL database integration via Supabase
- Product normalization
- Secure protected routes
- Marketplace-ready API architecture

## Tech Stack

- FastAPI
- SQLAlchemy
- PostgreSQL (Supabase)
- Pydantic v2
- JWT Authentication
- Python

## Features

- User registration
- User login
- Protected routes
- Seller-specific products
- Product creation
- Product listing
- Image array support
- WhatsApp seller integration
- Production-ready API structure

## Planned Features

- Cloudinary image uploads
- Seller analytics dashboard
- Marketplace trust system
- Advanced SaaS features
- Order management
- Payment integration

## Run Locally

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

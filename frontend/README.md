# Naijamart Frontend

Static HTML/Tailwind/JS frontend for a Nigerian e-commerce SaaS marketplace.

## Run
Open `index.html` in your browser, or serve with any static server:
```
python3 -m http.server 5500
```
Then visit http://localhost:5500

## Backend
Configured to talk to FastAPI at `http://127.0.0.1:8000`.
Edit `API_BASE` in `js/api.js` to change.

Endpoints used:
- POST /auth/login
- POST /auth/register
- GET  /products
- POST /products

If the backend is unreachable the UI gracefully falls back to demo data.

## Pages
- index.html — Landing page
- login.html / register.html — Auth
- product.html — Listing + product detail (?id=...)
- dashboard.html — Seller dashboard


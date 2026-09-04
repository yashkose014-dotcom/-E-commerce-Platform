# Urban Mart — Full-Stack E-Commerce Platform

Urban Mart is a professional, responsive e-commerce application with a React frontend, Node.js/Express backend, and MongoDB database.

## Features

### Storefront
- Responsive modern UI
- Dark/light theme
- Product catalog and search
- Category filtering and sorting
- Product details
- Cart and wishlist
- Authentication
- Checkout and order creation
- Order history
- Reviews
- Empty/loading/error states

### Backend
- REST API
- JWT authentication
- Customer/admin authorization
- MongoDB + Mongoose
- Product/category APIs
- Cart/wishlist/address APIs
- Orders and stock validation
- Coupon validation
- Reviews/ratings
- Notifications
- Admin dashboard APIs
- Rate limiting, Helmet, CORS and centralized error handling

### Admin
- Dashboard metrics
- Product listing/deletion
- Order status management
- User overview
- Category overview
- Coupon overview

## Run locally

### 1. Database
Install MongoDB or use MongoDB Atlas.

### 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
```

Backend: `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Linux/macOS:

```bash
cp .env.example .env
```

Frontend: `http://localhost:5173`

## Demo admin

Default seed credentials:

- Email: `admin@urbanmart.local`
- Password: `ChangeMe123!`

Change these values in `backend/.env` before any real deployment.

## Important production notes

- Set a strong random `JWT_SECRET`.
- Use MongoDB Atlas or secured MongoDB infrastructure.
- Use HTTPS.
- Replace the demo payment service with Razorpay/Stripe and verify payment signatures server-side.
- Never commit `.env` files.
- Store product images in a proper object/image storage service.
- Add automated CI tests before production release.

## Project structure

```text
Urban-Mart/
├── frontend/
├── backend/
├── database/
└── README.md
```

See `database/README.md` and `backend/TESTING.md` for database and API guidance.

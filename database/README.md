# Urban Mart Database

Urban Mart uses **MongoDB** with Mongoose.

## Collections

- `users` — customer/admin accounts and password hashes
- `categories` — product categories
- `products` — catalog, prices, stock, ratings
- `carts` — authenticated user carts
- `wishlists` — authenticated user wishlists
- `addresses` — saved delivery addresses
- `orders` — immutable purchase snapshots, totals, payment and shipping status
- `reviews` — product reviews and ratings
- `coupons` — discount rules
- `notifications` — user notifications

## Local setup

1. Install MongoDB Community Server or use MongoDB Atlas.
2. Create a database named `urban_mart`.
3. Copy `backend/.env.example` to `backend/.env`.
4. Set `MONGODB_URI`.
5. From `backend`, run:

```bash
npm install
npm run seed
npm run dev
```

The seed creates demo categories, six products, an admin account, and coupon `WELCOME10`.

## Data rules

- Product stock cannot be negative.
- Order items store the product name and price at purchase time.
- Passwords are stored as bcrypt hashes, never plaintext.
- Coupons are validated server-side.
- Tax is currently modeled at 18% and shipping is free at ₹999+.
- Payment is provider-neutral in this version; connect Razorpay/Stripe before production payments.

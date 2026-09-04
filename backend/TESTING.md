# Urban Mart Testing Checklist

## Manual API checks
1. `GET /api/health`
2. Register a customer.
3. Login and save the JWT.
4. Call `/api/auth/me` with a Bearer token.
5. List products and categories.
6. Create an address.
7. Save cart and wishlist data.
8. Validate a coupon.
9. Create an order and verify inventory decreases.
10. Add a review and verify product rating updates.
11. Login as admin and call `/api/admin/summary`.
12. Verify invalid tokens return 401 and non-admin users return 403 for admin routes.

## Frontend checks
- Desktop, tablet and mobile layouts
- Light/dark theme persistence
- Search and category filters
- Cart quantity/removal
- Wishlist add/remove
- Login/register errors
- Protected order/admin pages
- Checkout totals

For production, add automated unit and integration tests with a test runner and API test library.

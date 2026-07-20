# GrowLine API overview

All JSON endpoints are served from the backend origin. Protected endpoints require
`Authorization: Bearer <token>`. Customer, seller, and admin tokens are role-specific.

## Health

- `GET /health` — process liveness and database status; always suitable for liveness checks.
- `GET /ready` — readiness; returns `503` until MongoDB is connected.

## Customer account

- `POST /users/signup`, `POST /users/signin`, `POST /users/google-signin`
- `GET /users/profile`, `PUT /users/profile`, `PUT /users/password`
- `POST /users/address`, `PUT /users/address/:addressId`, `DELETE /users/address/:addressId`

Profile fields are `name`, `email`, and a 10-digit `mobile`. Address writes require
`name`, `mobile`, `address`, `city`, `state`, and a 6-digit `pincode`; `locality` is optional.

## Commerce

- Products: `/products`
- Cart and coupons: `/cart`, `/coupons`
- Customer orders: `/orders`
- Payment callback verification: `/payments/success`
- Customer assistant: `/ai/customer-assistant`

## Seller and admin

- Seller account and catalog: `/sellers`, `/seller-products`
- Seller orders and transactions: `/seller-orders`, `/transactions/seller`
- Admin account and overview: `/admin`
- Homepage merchandising: `/home-categories`, `/deals`

Payment completion verifies customer ownership, provider payment-link association, amount,
currency, and capture state. Provider keys are required for online payments and refunds.

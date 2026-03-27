# Thok Bazar

Multi-vendor e-commerce platform with:

- `frontend/`: Vite + React customer/admin/seller app
- `backend/`: Express + MongoDB API

## Does README help for deployment?

Yes. A good README removes guesswork during deployment by documenting:

- which folder each platform should deploy
- build and start commands
- required environment variables
- domain and CORS configuration
- SPA routing requirements
- payment callback URLs

This README now includes the deployment setup for:

- Frontend on Vercel
- Backend on Render

## Pre-deployment checklist

Before deploying, make sure all of these are ready:

1. Create production MongoDB credentials and store them in `MONGODB_URI`.
2. Set a strong `JWT_SECRET`.
3. Set a real `FRONTEND_URL` pointing to your production Vercel domain.
4. Set `CORS_ORIGINS` to your production frontend domain.
5. Add Razorpay keys if you want online payments enabled.
6. Add Gmail or SMTP credentials if OTP/email features are required.
7. Add Cloudinary values for image upload from the frontend.
8. Confirm the frontend uses the Render API URL via `VITE_API_BASE_URL`.
9. Test these flows in preview/staging before production:
   - signup/login
   - seller login
   - admin login
   - cart and checkout
   - payment success callback
   - AI assistant
   - direct URL refresh on routes like `/products/...` and `/customer/profile/...`

## Environment files

Example env files were added:

- [backend/.env.example](/c:/Users/himan/Projects/thok-bazar2/backend/.env.example)
- [frontend/.env.example](/c:/Users/himan/Projects/thok-bazar2/frontend/.env.example)

## Backend deployment on Render

Deploy the `backend` folder as a Node web service.

### Render settings

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/health`

### Backend environment variables

Required:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

Recommended:

- `NODE_ENV=production`
- `PORT=10000`
- `CORS_ORIGINS=https://your-frontend-domain.vercel.app`
- `ALLOW_VERCEL_PREVIEWS=true`
- `OPENAI_API_KEY`
- `CUSTOMER_AI_MODEL=gpt-4.1-mini`

### Notes

- The backend now reads MongoDB from env instead of a hardcoded URI.
- CORS is now restricted and supports explicit origins plus optional Vercel preview domains.
- The backend now exposes `/health` for Render health checks.
- The backend now has a production `start` script.

## Frontend deployment on Vercel

Deploy the `frontend` folder as a Vite app.

### Vercel settings

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Frontend environment variables

Required:

- `VITE_API_BASE_URL=https://your-render-service.onrender.com`

If uploads are used:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

### SPA routing

This project uses `BrowserRouter`, so direct route refreshes need rewrites.

A Vercel config was added here:

- [frontend/vercel.json](/c:/Users/himan/Projects/thok-bazar2/frontend/vercel.json)

That rewrite sends all routes to `index.html`, which is required for React Router deep links on Vercel.

## Domain and callback setup

For production, set:

- `FRONTEND_URL=https://your-frontend-domain.vercel.app`
- `VITE_API_BASE_URL=https://your-backend-service.onrender.com`

If you use a custom domain, update both values to the custom domains instead.

Razorpay payment success redirects depend on `FRONTEND_URL`, so this must be correct before enabling live payments.

## Deployment order

Recommended order:

1. Deploy backend to Render.
2. Copy the Render public API URL.
3. Set `VITE_API_BASE_URL` in Vercel.
4. Deploy frontend to Vercel.
5. Copy the Vercel production URL.
6. Set `FRONTEND_URL` and `CORS_ORIGINS` in Render.
7. Redeploy the Render backend.
8. Test auth, payments, route refreshes, and protected pages.

## Local development

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Deployment fixes already added

The project was updated for deployment readiness:

- frontend API base URL is now env-driven instead of hardcoded localhost
- backend CORS is now configurable
- backend startup is Render-friendly
- backend MongoDB and JWT secret are env-driven
- Vercel SPA rewrites were added
- signup navigation no longer relies on a hard page reload

## Official docs

- Vercel Vite deployment: https://vercel.com/docs/frameworks/frontend/vite
- Vercel `vercel.json` project configuration: https://vercel.com/docs/project-configuration/vercel-json
- Render Node deployment docs: https://render.com/docs/deploy-node-express-app
- Render environment variables docs: https://render.com/docs/configure-environment-variables

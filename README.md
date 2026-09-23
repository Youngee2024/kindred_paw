# KindredPaw

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://maya-insurance.vercel.app)
[![React](https://img.shields.io/badge/React-19-149eca.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)

A responsive pet-insurance experience with multi-step onboarding, personalized quotes, secure Paystack checkout and a persistent customer dashboard.

**Repository:** [github.com/Youngee2024/kindred_paw](https://github.com/Youngee2024/kindred_paw)

## Live demo

[https://maya-insurance.vercel.app](https://maya-insurance.vercel.app)

## Features

- Responsive landing page and authentication screens.
- Multi-step owner and pet insurance application.
- Review, confirmation and application reference generation.
- Personalised premium estimates based on pet age, breed, weight and medical history.
- Side-by-side coverage comparison with monthly and discounted annual billing.
- Paystack-hosted checkout for monthly and annual recurring payments.
- Server-side transaction initialization, amount verification and signed webhook handling.
- Printable receipts and customer payment history.
- Customer dashboard at `/dashboard`.
- Administration portal at `/admin` with application and claims decision queues.
- Customer, pet, plan and payment-record management.
- CSV exports for applications, claims, customers and payments.
- Submitted application and policy-status tracking.
- Multiple pet profiles with add, edit and remove actions.
- Claims submission and status history.
- Editable customer contact information.
- Browser persistence for frontend demonstration data.

## Technology

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- Vercel serverless functions
- Paystack Payments API
- Local storage for prototype persistence

## Development

```bash
npm install
npm run dev
```

Vite serves the frontend only. To exercise the `/api/payments/*` serverless functions locally, run the project with the Vercel CLI instead:

```bash
npx vercel dev
```

Copy `.env.example` to `.env.local` and add your Paystack test secret key:

```dotenv
PAYSTACK_SECRET_KEY=sk_test_replace_me
APP_URL=http://localhost:3000
```

`PAYSTACK_SECRET_KEY` is server-only. Never prefix it with `VITE_` or expose it in browser code. In Vercel, add both environment variables to the project and set the Paystack webhook URL to `https://your-domain.example/api/payments/webhook`.

The optional `VITE_ENABLE_DEMO_PAYMENTS=true` flag reveals a local simulation button. Leave it unset in production.

Production validation:

```bash
npm run lint
npm run build
```

## Production note

Authentication, policy decisions, claims processing and customer data currently run as a frontend demonstration. Initial verified payments are recorded in browser storage for the prototype. A production release should connect these workflows to authenticated backend services and a secure database so recurring webhook events and payment history are durable across devices.

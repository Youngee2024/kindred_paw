# KindredPaw

[![Live Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://maya-insurance.vercel.app)
[![React](https://img.shields.io/badge/React-19-149eca.svg)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com)

A responsive pet-insurance experience with multi-step onboarding and a persistent customer dashboard.

## Live demo

[https://maya-insurance.vercel.app](https://maya-insurance.vercel.app)

## Features

- Responsive landing page and authentication screens.
- Multi-step owner and pet insurance application.
- Review, confirmation and application reference generation.
- Customer dashboard at `/dashboard`.
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
- Local storage for prototype persistence

## Development

```bash
npm install
npm run dev
```

Production validation:

```bash
npm run lint
npm run build
```

## Production note

Authentication, policy decisions, claims processing and customer data currently run as a frontend demonstration. A production release should connect these workflows to authenticated backend services and a secure database.

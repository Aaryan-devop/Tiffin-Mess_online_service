# TiffinHub - SaaS Platform for Tiffin Services

A comprehensive, real-world SaaS platform designed to digitize local tiffin services and mess halls. This is a two-sided platform:

- **Consumer Web App**: For users to manage their daily meal subscriptions
- **Vendor Dashboard**: For small business owners to manage operations, billing, and eliminate food waste

## Tech Stack

- **Frontend**: Next.js 14 (App Router) for SEO optimization and fast rendering
- **Styling**: Tailwind CSS + shadcn/ui for accessible, fast UI components
- **Backend**: Next.js API Routes (Serverless functions)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Role-Based Access Control (RBAC)
- **External APIs**: WhatsApp Business API (Twilio), Razorpay/Stripe for payments

## Design System

- **Primary Brand Color**: Warm Amber/Burnt Orange (#f59e0b, #ea580c)
- **Secondary/Accent**: Forest Green (#16a34a)
- **Backgrounds**: Off-White (#f8fafc), White (#ffffff)
- **Text**: Dark Slate (#1e293b)

## Features

### Consumer Features
- Location-based vendor search
- Browse vendors with menus and ratings
- Daily meal dashboard with "Pause" functionality
- Billing and invoice tracking
- Flexible subscription management

### Vendor Features
- Overview showing "Meals to Cook Today" (with pause calculation)
- Subscriber CRM with filtering
- Daily menu planning with calendar
- WhatsApp broadcast to subscribers
- Revenue tracking and analytics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Git (optional)

### Installation

1. **Clone or navigate to this directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.local` to `.env.local` (it's already created as a template) and fill in:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL`: Your app URL (e.g., http://localhost:3000)
   - OAuth provider credentials (optional)
   - Payment gateway keys (Razorpay/Stripe)
   - WhatsApp/Twilio credentials

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:push

   # (Optional) Seed the database with sample data
   npm run db:seed
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The Prisma schema (`prisma/schema.prisma`) includes:

- `User` - Base user model with role (CONSUMER/VENDOR)
- `Vendor` - Vendor profiles with business details
- `Subscription` - Customer subscriptions to vendors
- `PauseRequest` - Tracking meal pauses
- `MealPlan` - Daily menu planning
- `Invoice` - Billing and invoices
- `Payment` - Payment transactions

## Project Structure

```
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/route.ts
│   ├── vendor/
│   │   ├── layout.tsx
│   │   ├── overview/page.tsx
│   │   ├── subscribers/page.tsx
│   │   ├── menu/page.tsx
│   │   └── broadcast/page.tsx
│   ├── dashboard/page.tsx
│   ├── billing/page.tsx
│   ├── discover/page.tsx
│   ├── login/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Site header/footer
│   ├── providers/       # Theme & Auth providers
│   ├── consumer/        # Consumer-specific components
│   └── vendor/          # Vendor-specific components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   ├── pause-logic.ts   # Core pause calculation logic
│   └── utils.ts         # Utility functions
├── prisma/
│   └── schema.prisma    # Database schema
└── middleware.ts        # Next.js middleware
```

## Core Logic: "Meals to Cook Today"

The key calculation for vendors:

```typescript
const mealsToCook = (activeSubscribers * mealsPerDay) - approvedPausesToday
```

Implementation in `lib/pause-logic.ts`:
- Only counts ACTIVE subscriptions (not expired/cancelled)
- Only subtracts APPROVED pause requests for the current date
- Respects each subscription's `mealsPerDay` value
- Provides detailed breakdown for vendor transparency

## Authentication & Authorization

- NextAuth.js with Credentials and Google OAuth providers
- Role-based separation: `CONSUMER` vs `VENDOR`
- Middleware protects routes based on role
- Session callbacks include user role

## API Routes

Ready to implement (endpoints to add in `app/api/`):

- `GET/POST /api/pause` - Create and manage pause requests
- `GET /api/subscription` - Get user subscriptions
- `POST /api/subscription` - Create subscription
- `GET /api/menu/today` - Get today's menu for vendors
- `POST /api/menu` - Create/update menu
- `POST /api/broadcast/whatsapp` - Send WhatsApp broadcast
- `POST /api/payments/create` - Create Razorpay/Stripe order
- `POST /api/payments/webhook` - Payment webhook handler
- `GET /api/invoices` - Generate and fetch invoices

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The app is compatible with any Node.js hosting that supports Next.js App Router and serverless functions.

## Environment Variables

See `.env.local` for the complete list of required environment variables:

- `DATABASE_URL` (required)
- `NEXTAUTH_SECRET` (required)
- `NEXTAUTH_URL` (required)
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (optional)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` (optional)
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` (optional)
- `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_WHATSAPP_NUMBER` (optional)

## Development Notes

### UI Components

We use shadcn/ui components which are installed individually. The components are located in `components/ui/` and are pre-configured with our theme colors.

### Styling

All colors are based on the design system in `tailwind.config.ts`. Custom utilities are defined in `app/globals.css`.

### TypeScript

The project is fully typed with TypeScript. The Prisma client types are automatically generated from the schema.

## Contributing

This is a starter template. Customize as needed for your specific requirements.

## License

MIT

# INOVAMARK — Multi-Vendor Marketplace

> Central Africa's premier multi-vendor e-commerce platform. Connecting local businesses with customers across Cameroon and the region.

## ✨ Features

- 🌍 **Bilingual** — English & French (next-intl)
- 🏪 **Multi-Vendor** — Vendor registration with admin approval workflow
- 💳 **Local Payments** — Orange Money, MTN Mobile Money, Cash on Delivery (via Campay)
- 📱 **Mobile-First** — Responsive design optimized for mobile browsing
- 🔐 **Auth** — NextAuth.js v5 with role-based access (Admin / Vendor / Customer)
- 📦 **Full Dashboard** — Vendor product management + Order tracking
- 🔍 **Search & Filter** — By category, city, name

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS + Shadcn/UI |
| Auth | NextAuth.js v5 |
| i18n | next-intl |
| Payments | Campay (Orange Money / MoMo) |

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your values (see .env.example for reference)
```

### 3. Set up the database
```bash
# Push the schema to your PostgreSQL database
npm run db:push

# OR run migrations
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@inovamark.cm | Admin@2024! |
| Vendor | marche.bio@gmail.com | Vendor@2024! |
| Vendor | elegance.boutique@gmail.com | Vendor@2024! |
| Customer | customer@example.cm | Customer@2024! |

## 📁 Project Structure

```
e-vendor/
├── app/
│   ├── [locale]/
│   │   ├── (public)/      # Landing, vendors, products
│   │   ├── (auth)/        # signin, signup, become-vendor
│   │   └── (dashboard)/
│   │       ├── vendor/    # Vendor dashboard
│   │       ├── admin/     # Admin panel
│   │       └── customer/  # Customer account
│   └── api/               # REST API routes
├── components/
│   ├── ui/                # Shadcn components
│   └── shared/            # Header, Footer, Cards
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── prisma.ts          # DB client
│   ├── delivery.ts        # Haversine delivery calculator
│   └── payments/          # Campay integration
├── messages/
│   ├── en.json            # English translations
│   └── fr.json            # French translations
└── prisma/
    ├── schema.prisma      # DB schema
    └── seeds/seed.ts      # Seed data
```

## 💰 Payment Integration

Payments use [Campay](https://docs.campay.net) as the aggregator:

1. Set `CAMPAY_USERNAME` and `CAMPAY_PASSWORD` in `.env.local`
2. Point webhook URL to `/api/payments/webhook`
3. The webhook updates order status on payment confirmation

## 🌐 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Required environment variables in Vercel dashboard:
- `DATABASE_URL`
- `AUTH_SECRET`
- `UPLOADTHING_SECRET` + `UPLOADTHING_APP_ID`
- `CAMPAY_USERNAME` + `CAMPAY_PASSWORD`
- `RESEND_API_KEY`

## 📝 API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register customer | — |
| GET | `/api/vendors` | List vendors | — |
| POST | `/api/vendors` | Register vendor | Customer |
| POST | `/api/vendors/[id]/approve` | Approve/reject vendor | Admin |
| GET | `/api/products` | List products | — |
| POST | `/api/products` | Create product | Vendor |
| GET | `/api/categories` | List categories | — |
| POST | `/api/categories` | Create category | Admin |
| POST | `/api/payments/webhook` | Payment webhook | Campay |

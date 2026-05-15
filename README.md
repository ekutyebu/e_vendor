# INOVAMARK — Elite E-Commerce Architecture

> Central Africa's premier multi-vendor e-commerce platform. Engineered with enterprise-grade security, lightning-fast dynamic rendering, and seamless cross-border logistics.

## ✨ Elite Features

- 🌍 **Bilingual Native** — English & French (next-intl)
- 🔐 **Dual-Factor Authentication (2FA)** — Mandatory Email and SMS verification for all accounts
- 🏪 **Multi-Vendor Ecosystem** — Vendor registration with strict admin approval workflow
- 💳 **Local & Global Payments** — Orange Money, MTN Mobile Money, Cash on Delivery (via Campay)
- 📱 **Mobile-First Excellence** — Premium responsive design with skeleton loaders and dynamic suspense
- 🛡️ **Role-Based Dashboards** — Segregated, ultra-secure profiles for Admins, Vendors, and Customers
- 📦 **Global Logistics** — Haversine-based delivery routing algorithms

## 🛠 Tech Stack

| Layer | Technology |
|-------|------|
| **Core Framework** | Next.js 14 (App Router, Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Database** | Neon Serverless PostgreSQL |
| **ORM** | Prisma 6.19 (WebSocket Pools via `@neondatabase/serverless`) |
| **Styling** | Tailwind CSS + Shadcn/UI |
| **Authentication** | NextAuth.js v5 + Custom OTP Verification |
| **i18n** | next-intl |

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
```
Ensure you have the following Elite keys configured:
- `PROD_DATABASE_URL` (Neon Serverless Connection String)
- `AUTH_SECRET` (For NextAuth session encryption)
- `CAMPAY_USERNAME` & `CAMPAY_PASSWORD`
- `RESEND_API_KEY` (For Email 2FA)
- `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN` (For SMS 2FA)

### 3. Initialize the Database
```bash
# Push the schema via TCP (Requires port 5432)
npx prisma db push

# Generate Prisma Client (WebSocket ready)
npx prisma generate

# Seed the database sequentially
npm run db:seed
```

### 4. Run the development server
```bash
npm run dev
```

## 🔒 Confidentiality & Security Protocols

This system handles sensitive financial and user identity data. 
- All passwords are encrypted via `bcrypt` (12 rounds).
- **No administrative bypass exists**. All admin access requires 2FA validation via authorized mobile devices.
- Neon Database connections use `sslmode=require` and WebSocket WSS encryption.

## 🧪 Demo Credentials (Development Only)

> **WARNING:** Do not use these accounts in a production environment.

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `admin@inovamark.cm` | `Admin@2024!` |
| **Master Vendor** | `marche.bio@gmail.com` | `Vendor@2024!` |
| **Elite Customer**| `customer@example.cm` | `Customer@2024!` |

*(Note: During development, the 2FA OTP codes are printed directly to the server terminal. In production, they are dispatched via Twilio/Resend).*

## 📁 Elite Project Architecture

```
e-vendor/
├── app/
│   ├── [locale]/
│   │   ├── (public)/      # Storefront (Home, Deals, Categories, Products)
│   │   ├── (auth)/        # Registration & OTP 2FA Flows
│   │   └── (dashboard)/   # Segregated Secure Zones
│   │       ├── admin/     # Super Admin Control Center
│   │       ├── vendor/    # Merchant Hub & Inventory
│   │       └── customer/  # Shopper Profile & Orders
│   └── api/               # Serverless Route Handlers
├── components/
│   ├── ui/                # Shadcn primitives (Skeletons, Buttons)
│   └── shared/            # Mega Menu Header, Footer, Under Construction
├── lib/
│   ├── auth.ts            # Security configurations
│   ├── prisma.ts          # Edge-compatible DB client
│   └── payments/          # Transaction handlers
├── messages/
│   ├── en.json            # English translations
│   └── fr.json            # French translations
└── prisma/
    └── schema.prisma      # DB schema (Includes OTP models)
```

## 🌐 Enterprise Deployment (Vercel)

Ensure Vercel is configured to bypass build cache for database actions.

```bash
vercel --prod
```

Required Production Environment Variables:
- `PROD_DATABASE_URL`
- `PROD_DATABASE_URL_UNPOOLED`
- `AUTH_SECRET`
- `TWILIO_AUTH_TOKEN` (SMS)
- `RESEND_API_KEY` (Email)

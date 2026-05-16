# INOVAMARK - Premium Multi-Vendor Marketplace

INOVAMARK is a high-security, professional e-commerce platform tailored for the Cameroonian market, featuring advanced merchant onboarding, manual verification workflows, and secure checkout.

## 🚀 Key Features

### 🛡️ Advanced Security & Verification
- **Rigorous Vendor Onboarding**: Multi-step verification including National ID/Passport uploads and Biometric (Facial) scans.
- **Manual Admin Review**: Every merchant is manually verified by administrators before they can sell.
- **Secure Checkout**: Authenticated-only checkout flow with support for MTN MoMo, Orange Money, and Bank Transfers.

### 📊 Elite Merchant Dashboard
- **Real-time Analytics**: Sales trajectory charts and user acquisition metrics.
- **Performance Monitoring**: Track product ratings, stock levels, and customer satisfaction.
- **Bilingual Support**: Full English and French support across all dashboards.

### 🏛️ Central Command (Admin)
- **Merchant Management**: Approve, reject, or request corrections on vendor applications with detailed feedback.
- **Platform Overview**: Monitor total revenue, active users, and pending verification queues.

## 🛠️ Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5 (Auth.js)
- **Styling**: Tailwind CSS with Premium Glassmorphism design
- **I18n**: Next-intl

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Environment Variables**:
   Create a `.env` file with `DATABASE_URL`, `AUTH_SECRET`, and `NEXTAUTH_URL`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🌐 Access Links
- **Marketplace**: `/en` or `/fr`
- **Merchant Dashboard**: `/[locale]/vendor`
- **Admin Command Center**: `/[locale]/admin`
- **Onboarding**: `/[locale]/become-vendor`

---
*Built with ❤️ for the next generation of Cameroonian commerce.*

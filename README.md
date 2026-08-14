# MSSN UI Library

Digital library for Muslim Students Society of Nigeria,
University of Ibadan.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Railway)
- **ORM**: Prisma
- **Auth**: NextAuth.js v5
- **Storage**: Cloudflare R2
- **UI**: Tailwind CSS + shadcn/ui
- **Deployment**: Railway

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Cloudflare R2 account

### Installation

```bash
# Clone repo
git clone https://github.com/your-org/mssnui-library.git
cd mssnui-library

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Fill in your values

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development server
npm run dev
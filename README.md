# Pickid - Psychological Test Platform

<div align="center">

**Providing fun experiences to discover yourself through various psychological tests**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-green.svg)](https://supabase.com/)
[![pnpm](https://img.shields.io/badge/pnpm-9.12.0-orange.svg)](https://pnpm.io/)
[![Vercel](https://img.shields.io/badge/Vercel-deployed-black.svg)](https://pickid-fo.vercel.app)

🌐 **[Live Demo](https://pickid-fo.vercel.app)**

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Scripts](#scripts)

---

## 🎯 About

Pickid is a modern psychological test platform designed for teens and 20s, offering:

- ✨ **Psychological Tests** - Personality and psychology analysis
- ⚖️ **Balance Games** - Choose between two options
- 🎓 **Quizzes** - Knowledge-based tests
- 🙂 **Personality Tests** - Character and trait analysis

Perfect for social media sharing on Instagram and TikTok!

### User Flow

> Home &nbsp; ➡️ &nbsp; Category Selection &nbsp; ➡️ &nbsp; Test &nbsp; ➡️ &nbsp; Result &nbsp; ➡️ &nbsp; Share or Retry

---

## ✨ Features

### User-Facing Features (Web)

- 📱 **Mobile-First Design** - Optimized for 480-768px viewports
- 🎨 **Beautiful UI** - Emotional design with Tailwind CSS + shadcn/ui
- 🚀 **Fast Performance** - Next.js SSR/ISR optimization
- 🔄 **Easy Sharing** - Native Share API + Clipboard
- 📊 **Personalized Results** - Detailed analysis and recommendations
- 🔍 **Category Filtering** - Browse by Psychology, Balance, Personality, etc.
- 🔐 **Authentication** - Supabase Auth with email/social login

### Admin Features

- 📊 **Dashboard** - Real-time statistics and analytics
- ✏️ **Test Management** - Create, edit, and delete tests with wizard UI
- 📁 **Category Management** - Organize tests by categories
- 👥 **User Management** - View and manage users
- 📈 **Test Analytics** - Track test performance metrics
- 📉 **Growth Analytics** - Funnel analysis and user retention
- 💬 **Feedback System** - Handle user suggestions

### Performance & SEO

- **SSR/CSR Strategy** - Optimized data fetching
- **Next.js Image** - Automatic image optimization
- **Code Splitting** - Reduced bundle size
- **TanStack Query Caching** - Smart data caching
- **Dynamic Metadata** - SEO-friendly meta tags
- **Sitemap Generation** - Auto-generated sitemap
- **GA4 Integration** - User behavior tracking

---

## 🛠 Tech Stack

### Web (apps/web)

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?logo=react&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

### Admin (apps/admin)

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)

### Infrastructure

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-000000?logo=turborepo&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 9.12.0+
- Supabase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/pickid.git
cd pickid
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
# Web app
cp apps/web/.env.example apps/web/.env.local

# Admin app
cp apps/admin/.env.example apps/admin/.env.local
```

See [ENV_GUIDE.md](./ENV_GUIDE.md) for detailed environment variable configuration.

4. **Start development servers**

```bash
# Run all apps
pnpm dev

# Or run specific app
pnpm --filter web dev      # Web at http://localhost:3000
pnpm --filter admin dev    # Admin at http://localhost:5173
```

---

## 📁 Project Structure

### Monorepo Architecture

```
pickid-monorepo/
├── apps/
│   ├── web/              # Next.js web app (FSD + MVVM)
│   └── admin/            # Vite admin app (Layered)
├── packages/
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── supabase/         # Supabase client + types
│   ├── shared/           # Shared utilities/hooks
│   ├── types/            # Shared type definitions
│   └── config/           # Shared configuration
└── supabase/             # Database migrations
```

### Web App Structure (FSD + MVVM)

```
apps/web/src/
├── app/                      # Next.js App Router (SSR/CSR)
│   ├── [domain]/
│   │   ├── components/       # Domain-specific UI
│   │   ├── hooks/           # Domain business logic
│   │   └── page.tsx         # Server component
│   ├── layout.tsx
│   └── page.tsx
│
├── api/services/             # Data Access Layer (Supabase)
├── components/               # Shared components
├── lib/                      # Utilities
├── constants/                # Constants
└── types/                    # Type definitions
```

### Admin App Structure (Layered)

```
apps/admin/src/
├── pages/                    # Presentation Layer
├── components/               # Reusable UI
├── hooks/                    # Business Logic Layer
├── services/                 # Data Access Layer (Supabase)
├── lib/                      # Infrastructure Layer
├── constants/                # Constants
└── types/                    # Type definitions
```

### Supabase Backend

- **RLS (Row Level Security)** - Applied to all tables
- **Database Functions** - `get_dashboard_stats`, `get_top_tests_today`, etc.
- **Automatic Counters** - Auto-increment for view/participation counts

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) | Comprehensive project overview, features, and roadmap |
| [apps/CLAUDE.md](./apps/CLAUDE.md) | Development guidelines and coding conventions |
| [apps/CLAUDE-REFACTORING.md](./apps/CLAUDE-REFACTORING.md) | Code refactoring best practices |
| [ENV_GUIDE.md](./ENV_GUIDE.md) | Environment variables guide |
| [Notion Planning](https://www.notion.so/ming96/Pickid-e7eb0c8f9e27425ba729008c84b40e1c?source=copy_link) | Service planning document (Korean) |

---

## 📜 Scripts

### Development

```bash
pnpm dev              # Run all apps
pnpm --filter web dev # Run web app only
pnpm --filter admin dev # Run admin app only
```

### Build

```bash
pnpm build            # Build all apps
pnpm --filter web build
pnpm --filter admin build
```

### Testing

```bash
pnpm test             # Run all tests
pnpm test:watch       # Watch mode
pnpm test:coverage    # Coverage report
```

### Code Quality

```bash
pnpm lint             # Lint code
pnpm type-check       # TypeScript check
pnpm format           # Format code
```

### Database

```bash
pnpm types            # Generate Supabase types (production)
pnpm types-local      # Generate Supabase types (local)
```

### Version Management

```bash
pnpm changeset        # Create changeset
pnpm version-packages # Update versions
pnpm release          # Deploy
```

---

## 🏗 Architecture Highlights

### Web App: MVVM Pattern

```tsx
// ViewModel: Business logic
export function useTest(testId: string) {
  return useQuery({
    queryKey: queryKeys.test.detail(testId),
    queryFn: () => testService.getTest(testId),
  });
}

// View: Presentation only
export function TestCard({ testId }: Props) {
  const { data: test, isLoading } = useTest(testId);

  if (isLoading) return <Spinner />;
  return <Card>{test.title}</Card>;
}
```

### Admin App: Layered Architecture

```
Presentation → Business Logic → Data Access → Infrastructure
   (Pages)    →    (Hooks)     →  (Services)  → (Supabase)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding conventions** (see `apps/CLAUDE.md`)
4. **Write tests** for new features
5. **Commit** (`git commit -m 'feat: Add amazing feature'`)
6. **Push** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Commit Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update build scripts
```

---

## 📝 License

[Specify your license]

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend infrastructure
- [Vercel](https://vercel.com/) - Hosting platform
- [TanStack Query](https://tanstack.com/query) - Data fetching library

---

<div align="center">

**Made with ❤️ for discovering yourself**

[🌐 Visit Pickid](https://pickid-fo.vercel.app) | [📖 Documentation](./PROJECT-OVERVIEW.md)

</div>

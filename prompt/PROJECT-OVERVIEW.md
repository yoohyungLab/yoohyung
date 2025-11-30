# Pickid Project Overview

## Service Name

**Pickid**

---

## Purpose

<aside>
💡 **Providing fun experiences to discover yourself through various psychological tests**

- ✨ **Psychological Tests**: Personality and psychology analysis
- ⚖️ **Balance Games**: Choose between two options
- 🎓 **Quizzes**: Knowledge-based tests
- 🙂 **Personality Tests**: Character and trait analysis

</aside>

- Emotional UI that appeals to teens and 20s
- **Light and fun content experience**
- Results can be **shared, saved, and extended to additional content**

---

## Target Users

| Category | Details |
| --- | --- |
| Age | Late teens ~ 20s |
| Gender | Female-focused |
| Context | Instagram sharing, TikTok sharing, testing with friends |
| Preferred Style | Emotional, intuitive, casual content |

---

## Basic Flow

### **Web**

<aside>
💡 Home → Category Selection → Test Selection → Questions → Result → Share

</aside>

- Questions displayed one at a time (slide format)
- Progress indicator
- Result = Personality summary + Traits + Recommended type
- Share = Native Share API / Clipboard copy

### **Admin**

<aside>
💡 Login → Dashboard → Content Management / Data Analytics

</aside>

---

## Core Features

### **Web (apps/web)**

| Feature | Description |
| --- | --- |
| Mobile Optimization | Responsive design for 480~768px |
| Test Progress | Slide-based UI with top progress bar |
| Result Display | Layout varies by test type |
| Result Storage | Temporary storage in session storage |
| OG Images | Auto-generated for each result |
| Share Function | Native Share API / Clipboard |
| Category Filter | Psychology/Balance/Personality/Romance |
| Popular Tests | Recommendations based on participation count |
| Feedback | Submit/view suggestions |
| Authentication | Supabase Auth login/signup |
| My Page | User profile management (coming soon) |

### **Admin (apps/admin)**

| Feature | Description |
| --- | --- |
| Dashboard | Test/User/Response statistics |
| Test Management | Create/Update/Delete tests |
| Category Management | Test category CRUD |
| User Management | View user data |
| Response Management | View test responses |
| Test Performance | Analyze test performance |
| Growth Analytics | Inflow/Funnel/Registration analysis |
| Feedback Management | Manage user suggestions |

---

## Tech Stack

### **Web (apps/web)**

| Category | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 18 + shadcn/ui |
| Styling | Tailwind CSS |
| State Management | TanStack Query + Zustand |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel |
| Analytics | GA4 + Event Tracking |
| Architecture | FSD + MVVM |
| Type Safety | TypeScript strict |
| Testing | Jest + RTL |
| Performance | Lighthouse CI |

### **Admin (apps/admin)**

| Category | Technology |
| --- | --- |
| Framework | Vite + React 18 |
| Router | React Router v6 |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | TanStack Query |
| Forms | React Hook Form + Zod |
| Database | Supabase |
| Deployment | Vercel |
| Architecture | Layered (Presentation → Business → Data) |
| Type Safety | TypeScript strict |
| Testing | Jest + RTL |

### **Shared (Monorepo)**

| Category | Technology |
| --- | --- |
| Package Manager | pnpm workspace |
| Build Tool | Turbo |
| Shared Packages | @pickid/ui, @pickid/shared, @pickid/supabase, @pickid/types |
| Versioning | Changesets |

---

## 📁 Project Structure

```
pickid-monorepo/
├── apps/
│   ├── web/          # Next.js web app (FSD + MVVM)
│   └── admin/        # Vite admin app (Layered)
├── packages/
│   ├── ui/           # Shared UI components (shadcn/ui)
│   ├── shared/       # Shared utilities/hooks
│   ├── supabase/     # Supabase client + types
│   └── types/        # Type definitions
└── supabase/         # Migrations and configuration
```

---

## 🔑 Key Features

### Business Features

- **Multiple Test Types**: Psychological tests, balance games, quizzes, personality tests
- **Social Sharing**: Optimized for Instagram/TikTok sharing
- **Personalized Results**: Detailed personality analysis with recommendations
- **Real-time Analytics**: Track test performance and user engagement
- **Content Management**: Easy-to-use admin panel for test creation

### Technical Features

- **Monorepo Architecture**: Code consistency between web/admin
- **Type Safety**: TypeScript strict + Supabase-generated types
- **Performance Optimized**: Next.js SSR/ISR for fast loading
- **Accessible**: shadcn/ui-based components with a11y compliance
- **Developer Experience**: ESLint, Prettier, Jest for quality code
- **Scalable**: Feature-Sliced Design for maintainability

---

## 🎯 User Journey

### First-time User

1. **Landing**: Browse popular tests on home page
2. **Discovery**: Filter by category or search
3. **Engagement**: Take test with intuitive slide UI
4. **Results**: View personalized results with detailed analysis
5. **Share**: Share on social media or save results
6. **Return**: Come back for more tests

### Admin User

1. **Login**: Authenticate with Supabase Auth
2. **Dashboard**: View key metrics and statistics
3. **Create**: Build new tests with step-by-step wizard
4. **Analyze**: Monitor test performance and user feedback
5. **Optimize**: Improve tests based on analytics data

---

## 📊 Data Model

### Core Entities

- **Tests**: Test metadata, questions, results
- **Categories**: Test categorization (Psychology, Balance, etc.)
- **Questions**: Test questions with options
- **Results**: Possible test outcomes
- **User Responses**: User answers and results
- **Feedbacks**: User suggestions and bug reports
- **Users**: User profiles and authentication

### Database Schema

See `supabase/migrations/` for detailed schema definitions.

---

## 🚀 Development Workflow

### Setting Up

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local

# Start Supabase locally (optional)
pnpm supabase:start

# Run development servers
pnpm dev
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter web build
pnpm --filter admin build
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run coverage
pnpm test:coverage
```

---

## 🎨 Design Principles

### User Interface

- **Mobile-first**: Optimized for 480-768px viewports
- **Emotional Design**: Appealing to teens and 20s
- **Minimalist**: Clean and focused layouts
- **Accessible**: WCAG 2.1 AA compliance

### User Experience

- **Fast**: < 3s initial load time
- **Intuitive**: One-click interactions
- **Engaging**: Progress indicators and animations
- **Shareable**: Optimized for social media sharing

---

## 📈 Analytics & Metrics

### Key Performance Indicators (KPIs)

- **Test Completion Rate**: % of users who finish tests
- **Share Rate**: % of users who share results
- **Return Rate**: % of users who take multiple tests
- **Average Session Duration**: Time spent on site
- **Popular Tests**: Most completed tests

### Analytics Tools

- **Google Analytics 4**: User behavior tracking
- **Custom Events**: Test start, completion, sharing
- **Supabase Analytics**: Database performance
- **Lighthouse CI**: Performance monitoring

---

## 🔐 Security & Privacy

### Authentication

- Supabase Auth with email/social login
- Row Level Security (RLS) policies
- Secure session management

### Data Protection

- GDPR compliance considerations
- User data encryption at rest
- Secure API endpoints with authentication

---

## 🛠 Future Roadmap

### Planned Features

- [ ] User profile and test history
- [ ] Test recommendations based on previous results
- [ ] Social features (friend comparisons)
- [ ] Premium test content
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] AI-generated test results

### Technical Improvements

- [ ] Server-side pagination for large datasets
- [ ] Advanced caching strategies
- [ ] Real-time collaboration for admin
- [ ] A/B testing framework
- [ ] Enhanced analytics dashboard

---

## 📞 Support & Contact

For questions or support:

- **GitHub Issues**: Report bugs or request features
- **Documentation**: See `/apps/CLAUDE.md` for development guidelines
- **Email**: [Contact email if available]

---

## 📄 License

[Specify license if applicable]

---

**Last Updated**: 2025-11-30

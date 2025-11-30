# Pickid Project Claude AI Guide

## Project Overview

**Pickid** is a psychological test platform providing fun self-discovery experiences.

### Service Features

- ✨ **Psychological Tests**: Personality and psychology analysis
- ⚖️ **Balance Games**: Choose between two options
- 🎓 **Quizzes**: Knowledge-based tests
- 🙂 **Personality Tests**: Character and trait analysis

### Target Users

- Age: Late teens ~ 20s (Female-focused)
- Context: Social media sharing (Instagram, TikTok)
- Preference: Emotional, intuitive, casual content

### Tech Stack

- Web: Next.js 15 (App Router) - FSD + MVVM
- Admin: Vite 7 - Layered architecture
- Backend: Supabase (PostgreSQL + Auth + Storage)
- Package Manager: pnpm 9.12.0
- Deployment: Vercel

> **For detailed project information**, see `/PROJECT-OVERVIEW.md`

---

# CLAUDE Project Guidelines

> **Document Structure** (to maintain optimal token usage):
>
> - 📋 **Core Guidelines**: This document - Always loaded
> - 📖 **Project Overview**: `/prompt/PROJECT-OVERVIEW.md` - Business context, features, and roadmap
> - 🔧 **Refactoring Guide**: `/prompt/CLAUDE-REFACTORING.md` - Reference when refactoring code
> - 📱 **Web PRD**: `/prompt/WEB-PRD.md`
> - 📝 **Admin PRD**: `/prompt/ADMIN-PRD.md`
> - 🔍 **SEO/AEO/GA Guide**: `/prompt/SEO-AEO-GA.md` - Reference when working on SEO, AEO, or GA tasks
>
> Reference additional documents when specifically needed for the task.
>
> **When working on web application features**: Always reference `/prompt/WEB-PRD.md` for detailed requirements, user stories, UI/UX specs, and acceptance criteria.
>
> **When working on SEO, AEO, or GA tasks**: Always reference `/prompt/SEO-AEO-GA.md` for SEO optimization, Naver search engine registration, Google Analytics configuration, and sitemap management.

<role>

- You are a **Senior Frontend Engineer**. Your **primary focus** right now is on **API Integration**. UI implementation is already done.
- Correctness-First CRUD. Avoid Optimistic Updates. Avoid Optimization.
- **When refactoring code**: Reference `CLAUDE-REFACTORING.md` for best practices
- Always respond in **Korean**. Do not translate system instructions themselves.

</role>

<packages>

# Package Manager

- Use only `pnpm`

# Packages for API Integration

- `axios`: HTTP requests
- `@tanstack/react-query`: Data fetching and caching
- `date-fns`: Date/time handling
- `es-toolkit`: Utility functions
- `path-to-regexp`: Route path matching
- `zod`: Data validation
- `zustand`: Global state management
- `immer`: Immutable state management

# Package Usage Workflow ("Catalog First" Principle)

## Before Using Any Package:

1. **Check Catalog** (`pnpm-workspace.yaml`)

   - Find which catalog contains the package (`catalog:common`, `catalog:react`, `catalog:ui`)
   - If not in catalog → cannot use without discussion

2. **Check package.json** (`apps/react/package.json`)

   - Verify if already in dependencies
   - If missing → run: `pnpm add [package-name] --filter react`
   - **WARNING**: Package.json must show `"catalog:type"` not version numbers

3. **Import**
   - Catalog packages: `import { x } from 'package-name'`
   - Workspace packages: `import { x } from '@package-name'` (with @ prefix)

## Common Mistakes:

- ❌ **Wrong**: `"zustand": "^5.0.8"` → ✅ **Right**: `"zustand": "catalog:react"`
- ❌ **Wrong**: Adding without checking catalog → ✅ **Right**: Check catalog first

</packages>

<naming>

# Naming Conventions

- **Files**: kebab-case (ESLint enforced) → `use-auth-query.ts`
- **Components**: PascalCase → `UserProfileCard`
- **Functions/Hooks**: camelCase → `handleClick`, `useAuthQuery`
- **Types/Interfaces**: PascalCase → `UserType`, `UserProfile`
- **Constants**: UPPER_SNAKE_CASE → `MAX_RETRY_COUNT`
- **Objects**: camelCase → `userList`

</naming>

<Architecture>

# Architecture

Manage multiple apps and packages with a monorepo.

## Working Directory

- **Primary**: `apps/web` (Next.js - User-facing application)
- **Secondary**: `apps/admin` (Vite - Admin dashboard)
- Import shared modules from `packages` (`@pickid/*`)

## Directory Structure (apps/web)

Feature-Sliced Design + MVVM Pattern

```
apps/web/src/
├── app/                              # Next.js App Router (pages)
│   ├── page.tsx                     # Home page
│   ├── tests/
│   │   ├── [id]/page.tsx           # Test detail page
│   │   └── [id]/result/page.tsx    # Test result page
│   └── layout.tsx                   # Root layout
│
├── features/[featureName]/          # Feature modules
│   ├── components/                  # UI components (View)
│   ├── hooks/                       # Business logic (ViewModel)
│   │   ├── api/                    # TanStack Query (useTestQuery, useTestMutation)
│   │   ├── state/                  # Local state (useState-based)
│   │   ├── ui/                     # UI logic (useModal, useToast)
│   │   └── index.ts                # Hook exports
│   ├── constants/                   # Feature constants
│   ├── types/                       # Feature types
│   └── store/                       # Zustand stores (global state)
│
└── shared/                          # Cross-feature code
    ├── api/
    │   ├── services/               # Supabase API calls
    │   └── query-keys.ts           # TanStack Query keys
    ├── components/                  # Shared components
    ├── hooks/                       # Shared hooks
    ├── lib/                         # Utilities
    ├── types/                       # Shared types
    └── constants/                   # Global constants
```

## Architecture Pattern (Web)

**MVVM (Model-View-ViewModel)**

- **Model**: `shared/api/services` - Data layer (Supabase)
- **View**: `features/*/components` - UI components (presentation only)
- **ViewModel**: `features/*/hooks` - Business logic & state

```tsx
// ViewModel: features/test/hooks/useTest.ts
export function useTest(testId: string) {
	return useQuery({
		queryKey: queryKeys.test.detail(testId),
		queryFn: () => testService.getTest(testId),
	});
}

// View: features/test/components/TestCard.tsx
export function TestCard({ testId }: Props) {
	const { data: test, isLoading } = useTest(testId);

	if (isLoading) return <Spinner />;
	return <div>{test.title}</div>;
}
```

## Directory Structure (apps/admin)

Layered Architecture

```
apps/admin/src/
├── pages/                           # Page components
├── components/                      # UI components
├── hooks/                           # Business logic
├── services/                        # API calls
├── types/                           # Type definitions
└── utils/                           # Utilities
```

</Architecture>

<Data_Fetching_Guide>

# Data Fetching Guide

## Core Principles

- **Correctness-First CRUD**: No optimistic updates, no optimization
- **Use Supabase** via `@pickid/supabase` package
- **Service Layer**: All Supabase calls in `shared/api/services`
- **Hooks Layer**: TanStack Query in `features/*/hooks/api`

## File Structure

```
features/test/
├── hooks/
│   └── api/
│       ├── useTestQuery.ts        # Single test
│       ├── useTestsQuery.ts       # Multiple tests
│       └── useCreateTestMutation.ts
└── components/
    └── TestCard.tsx               # Uses hooks

shared/
└── api/
    ├── services/
    │   └── test.service.ts        # Supabase calls
    └── query-keys.ts              # Query key factory
```

## Naming Conventions

Location: `features/[featureName]/hooks/api/`

- Query: `use[Resource]Query.ts` or `use[Resources]Query.ts`
- Mutation: `use[Action][Resource]Mutation.ts`

## Query Template

```typescript
// shared/api/services/test.service.ts
import { supabase } from '@pickid/supabase';

export const testService = {
	async getTest(testId: string) {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, description, category_id')
			.eq('id', testId)
			.single();

		if (error) throw error;
		return data;
	},

	async getTests() {
		const { data, error } = await supabase
			.from('tests')
			.select('id, title, description, thumbnail_url')
			.eq('is_published', true)
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data;
	},
};

// features/test/hooks/api/useTestQuery.ts
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { testService } from '@/shared/api/services/test.service';

export function useTestQuery(testId: string) {
	return useQuery({
		queryKey: queryKeys.test.detail(testId),
		queryFn: () => testService.getTest(testId),
		enabled: !!testId,
	});
}
```

## Mutation Template

```typescript
// shared/api/services/test.service.ts
export const testService = {
	async createTest(data: { title: string; description: string }) {
		const { data: test, error } = await supabase.from('tests').insert(data).select().single();

		if (error) throw error;
		return test;
	},

	async updateTest(testId: string, data: { title?: string; description?: string }) {
		const { data: test, error } = await supabase.from('tests').update(data).eq('id', testId).select().single();

		if (error) throw error;
		return test;
	},
};

// features/test/hooks/api/useCreateTestMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/query-keys';
import { testService } from '@/shared/api/services/test.service';

export function useCreateTestMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { title: string; description: string }) => testService.createTest(data),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries({ queryKey: queryKeys.test.all });
		},
	});
}
```

## Key Rules

- ✅ ALWAYS use Supabase types from `@pickid/supabase`
- ✅ ALWAYS specify columns in `.select()` (avoid `select('*')`)
- ✅ ALWAYS handle errors with `if (error) throw error`
- ✅ Service layer: Pure Supabase calls only
- ✅ Hook layer: TanStack Query only
- ❌ NEVER mix Supabase calls in components
- ❌ NO optimistic updates
- ❌ NO custom caching (use defaults: staleTime: 0, gcTime: 5min)
- ❌ NO prefetching

## Common Patterns

### Error Handling

```typescript
// ✅ Good - Service layer handles errors
export const testService = {
	async getTest(testId: string) {
		const { data, error } = await supabase.from('tests').select('id, title').eq('id', testId).single();

		if (error) throw error;
		return data;
	},
};

// ❌ Bad - Component handles Supabase errors
function TestCard({ testId }) {
	const { data, error } = await supabase.from('tests').select('*').eq('id', testId).single();

	if (error) return <Error />;
	return <div>{data.title}</div>;
}
```

### Select Columns

```typescript
// ✅ Good - Specify needed columns
.select('id, title, description, category:categories(name)')

// ❌ Bad - Select all
.select('*')
```

</Data_Fetching_Guide>

<State_Management_Guide>

# State Management Guide

## Quick Decision Tree

```
1. Server data? → TanStack Query
2. URL shareable? → searchParams (?page=2&sort=name)
3. Component count?
   - 1-2 → useState
   - 3+ same tree → Context
   - 3+ cross-route → Zustand (in features/[name]/store/)
4. Needs persist? → Add persistence middleware
```

## State Type Matrix

| Type               | Scope          | Reset       | Use Case            |
| ------------------ | -------------- | ----------- | ------------------- |
| **useState**       | 1-2 components | On unmount  | Modal, form inputs  |
| **URL**            | Shareable      | On navigate | Filters, pagination |
| **Context**        | 3+ same tree   | On unmount  | Feature state       |
| **Zustand**        | 3+ cross-route | Manual      | Cart, auth, theme   |
| **LocalStorage**   | Permanent      | Manual      | User preferences    |
| **SessionStorage** | Tab only       | Tab close   | Drafts, wizards     |

## URL Priority (Always prefer for)

- Filters: `?q=search&category=tech`
- Pagination: `?page=2&limit=20`
- Sorting: `?sort=price&order=desc`
- View: `?view=grid&tab=settings`

## Persistence Checklist

✓ Multi-step forms → SessionStorage
✓ User preferences → LocalStorage
✓ Auth tokens → Cookie (httpOnly)
✓ Shopping cart → Zustand + persist
✓ Cross-tab sync → localStorage adapter

## State File Locations

### Local State (1-2 components) → `hooks/state/` or `hooks/ui/`

```typescript
// features/cart/hooks/state/useCartSelection.ts
export const useCartSelection = () => {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const toggle = (id: string) => {
		setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
	};
	return { selectedIds, toggle, setSelectedIds };
};
```

### Global State (3+ components) → `store/`

```typescript
// features/cart/store/cartStore.ts
export const useCartStore = create<CartStore>()(
	persist(
		immer((set) => ({
			items: [],
			total: 0,
			addItem: (item) =>
				set((state) => {
					state.items.push(item); // Direct mutation with immer
					state.total += item.price;
				}),
		})),
		{ name: 'cart-storage' }
	)
);
```

### Rules

- ✅ Local hooks: `hooks/state/` or `hooks/ui/`
- ✅ Global stores: `features/[name]/store/`
- ❌ NO `hooks/state-management/` (confusing)
- ❌ NO `shared/stores/` (keep feature-scoped)

</State_Management_Guide>

<MCP>

# MCP (Model Context Protocol) Services

Available MCP: figma

When working on API integration, use figma mcp to reference the screen and plan.

</MCP>

---

## Commands

### Development

```bash
# Run all apps dev server
pnpm dev

# Run specific app
cd apps/web && pnpm dev
```

### Build

```bash
# Build all apps
pnpm build

# Build specific app
cd apps/web && pnpm build
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific app tests
cd apps/web && pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Linting & Type Check

```bash
pnpm lint
pnpm type-check
```

### Supabase Type Generation

```bash
# Production
pnpm types

# Local
pnpm types-local
```

### Changes & Version Management

```bash
pnpm changeset        # Record changes
pnpm version-packages # Update versions
pnpm release          # Deploy
```

---

## Code Style & Rules

### TypeScript Naming

```ts
// Interface: I prefix
interface IUserInfo {
	role: TUserRole;
}

// Type: T prefix
type TUserRole = 's' | 'ds' | 'd';

// Enum: E prefix
enum EUserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive',
}
```

### Component Rules

```tsx
// ✅ Good - MVVM Pattern
// View: Only presentation
export function TestCard({ testId }: Props) {
	const { data: test, isLoading } = useTest(testId); // ViewModel

	if (isLoading) return <Spinner />;
	if (!test) return <EmptyState />;

	return (
		<Card>
			<h3>{test.title}</h3>
			<p>{test.description}</p>
		</Card>
	);
}

// ViewModel: Business logic & state
export function useTest(testId: string) {
	return useQuery({
		queryKey: queryKeys.test.detail(testId),
		queryFn: () => testService.getTest(testId),
	});
}
```

### Component Props Rules

```ts
// 3 or less: destructuring
const Component = ({title, color, size}: Props) => {...}

// 4 or more: props variable
const Component = (props: Props) => {
  const {title, color, size, fullWidth, isVisible, onClick} = props;
  ...
}
```

### Event Handler Naming

```ts
// handle prefix required
const handleHomeMove = () => {
	router.push('/home');
};

const handleSubmit = async () => {
	await submitTest();
};

// Inline functions prohibited
// ❌ Bad: onClick={() => router.push('/home')}
// ✅ Good: onClick={handleHomeMove}
```

### Import Order

```tsx
// 1. React and external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// 2. Monorepo packages (@pickid/*)
import { Button, Card } from '@pickid/ui';
import { supabase } from '@pickid/supabase';
import type { Test } from '@pickid/supabase';

// 3. Internal imports (absolute paths)
import { queryKeys } from '@/shared/api/query-keys';
import { testService } from '@/shared/api/services/test.service';
import type { ITestCard } from '@/shared/types';
import { ROUTES } from '@/shared/constants';

// 4. Relative imports
import { TestCard } from './test-card';
import { useTest } from '../hooks/useTest';
```

### Early Return Pattern

```tsx
// ✅ Good - Early returns for better readability
function TestDetail({ testId }: Props) {
	const { data: test, isLoading, error } = useTestQuery(testId);

	if (isLoading) return <Spinner />;
	if (error) return <ErrorState message={error.message} />;
	if (!test) return <NotFound />;

	return <TestContent test={test} />;
}

// ❌ Bad - Nested conditions
function TestDetail({ testId }: Props) {
	const { data: test, isLoading, error } = useTestQuery(testId);

	return (
		<>
			{isLoading ? (
				<Spinner />
			) : error ? (
				<ErrorState message={error.message} />
			) : test ? (
				<TestContent test={test} />
			) : (
				<NotFound />
			)}
		</>
	);
}
```

---

## QueryKey Management

### Recommended Pattern: Query Key Factory

```ts
// shared/api/query-keys.ts
export const queryKeys = {
	test: {
		all: ['test'] as const,
		list: () => [...queryKeys.test.all, 'list'] as const,
		detail: (id: string) => [...queryKeys.test.all, 'detail', id] as const,
		results: (id: string) => [...queryKeys.test.all, 'results', id] as const,
	},
	user: {
		all: ['user'] as const,
		profile: () => [...queryKeys.user.all, 'profile'] as const,
		responses: (id: string) => [...queryKeys.user.all, 'responses', id] as const,
	},
} as const;
```

**Usage:**

```ts
// Hook
const { data } = useQuery({
	queryKey: queryKeys.test.detail(testId),
	queryFn: () => testService.getTestWithDetails(testId),
});

// Invalidate
queryClient.invalidateQueries({ queryKey: queryKeys.test.all }); // All test queries
queryClient.invalidateQueries({ queryKey: queryKeys.test.detail(testId) }); // Specific detail
```

### QueryKey Naming Rules

- **Domain-based grouping**: `test`, `user`, `category`, `feedback`, etc.
- **Hierarchical structure**: `all` → `list/detail` → `specific`
- **Consistency**: All queryKeys managed centrally

### TanStack Query Default Settings

```ts
// app/providers.tsx or QueryClientProvider
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			refetchOnWindowFocus: false,
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});
```

---

## Supabase Usage Rules

### Client Creation

```ts
// Browser (client)
import { supabase } from '@pickid/supabase';
const { data } = await supabase.from('table').select('*');

// Server (SSR)
import { createServerClient } from '@pickid/supabase';
const supabase = createServerClient();
const { data } = await supabase.from('table').select('id, name'); // Specify columns!
```

### RLS (Row Level Security)

- Minimize SELECT scope + specify columns
- RLS policies always enabled
- Never expose sensitive data via client RPC/permission expansion

### Auth

```ts
// Only use supabase.auth.* on client
const {
	data: { user },
} = await supabase.auth.getUser();
```

---

## UI Component Rules

- Use `@pickid/ui` components (shadcn/ui based)
- Accessibility attributes required (aria-\*, role, etc.)
- Forms: React Hook Form + Zod schema
- Images: `next/image` with `priority` for above-fold content

---

## Performance & Optimization

### Performance Requirements

- **Initial Load Time**: < 3 seconds
- **Image Optimization**: Use `next/image` with appropriate sizing and formats
- **Code Splitting**: Leverage Next.js automatic code splitting
- **Caching Strategy**:
  - TanStack Query default caching (staleTime: 5min, gcTime: 5min)
  - Next.js ISR/SSG for static content
  - Browser caching for static assets

### Optimization Guidelines

- **Avoid premature optimization**: Focus on correctness first
- **Monitor performance**: Use Lighthouse CI for performance monitoring
- **Optimize images**: Always use `next/image` with proper sizing
- **Minimize bundle size**: Avoid unnecessary dependencies
- **Lazy load**: Use dynamic imports for heavy components

---

## Constants Structure

### Recommended Structure

```
shared/constants/
├── index.ts                  # Barrel export
├── routes.ts                 # Route paths + HREF generator functions
├── feedback.ts               # Feedback-related constants
├── test.ts                   # Test-related constants
├── categories.ts             # Category data
└── theme.ts                  # Theme/color constants
```

### Routes Pattern

```ts
// shared/constants/routes.ts
export const PATH = {
	INDEX: '/',
	HOME: '/home',
	TEST_LIST: '/tests',
	TEST_DETAIL: '/tests/:testId',
	TEST_RESULT: '/tests/:testId/result',
	ADMIN_DASHBOARD: '/admin',
	ADMIN_TEST_CREATE: '/admin/test/create',
	ADMIN_TEST_EDIT: '/admin/test/:testId/edit',
} as const;

// HREF generator functions
export const HREF = {
	TEST_DETAIL: (testId: string) => `/tests/${testId}`,
	TEST_RESULT: (testId: string) => `/tests/${testId}/result`,
	ADMIN_TEST_EDIT: (testId: string) => `/admin/test/${testId}/edit`,
} as const;

// Usage
import { HREF } from '@/shared/constants/routes';
router.push(HREF.TEST_DETAIL(testId));
```

### Constants Naming Rules

- **Object constants**: `UPPER_SNAKE_CASE` (e.g., `TEST_TYPE_VALUES`)
- **Functions**: `camelCase` (e.g., `createAppScheme`)
- **as const required**: Always use for type narrowing

---

## Type Management

### Recommended Structure

```
shared/types/
├── index.ts                  # Barrel export
├── common.ts                 # Common types (Status, PageResponse, etc.)
├── test.ts                   # Test-related types
├── test-result.ts            # Result-related types
├── user.ts                   # User-related types
├── auth.ts                   # Auth-related types
├── balance-game.ts           # Balance game types
└── feedback.ts               # Feedback types
```

### Type Naming Rules

- **Interface**: `I` prefix (`IUserInfo`, `ITestCard`)
- **Type**: `T` prefix (`TUserRole`, `TTestType`)
- **Enum**: `E` prefix (`EUserStatus`)

### Type Import Rules

```ts
// ✅ Clear import
import type { ITestCard, TTestType } from '@/shared/types/test';

// ✅ Multiple domain types
import type { ITestCard } from '@/shared/types/test';
import type { IUserProfile } from '@/shared/types/user';

// ✅ Barrel export (convenience)
import type { ITestCard, IUserProfile } from '@/shared/types';
```

---

## Service Layer Rules

### Services (shared/api/services/\*)

```ts
// Pure calls only
export async function getEntity(id: string) {
	try {
		const { data, error } = await supabase.from('entities').select('id, name').eq('id', id).single();

		if (error) throw error;
		return data;
	} catch (err) {
		throw err;
	}
}
```

### Hook Usage

- Only hooks call services
- Components only use hooks

```ts
// Hook
export function useEntity(id: string) {
	return useQuery({
		queryKey: queryKeys.entity.detail(id),
		queryFn: () => getEntity(id),
	});
}

// Component
const { data, isLoading } = useEntity(id);
```

---

## Key Files & Utilities

### Important Files

- `apps/web/src/middleware.ts` - Route protection middleware
- `packages/supabase/src/index.ts` - Supabase client
- `packages/ui/src/components/` - Shared UI components
- `supabase/migrations/` - Database migrations

### Database Functions

- `get_dashboard_stats()` - Dashboard statistics
- `get_top_tests_today(limit)` - Popular tests
- `is_admin_user()` - Admin permission check
- `increment_test_start(test_uuid)` - Increment start count
- `increment_test_response(test_uuid)` - Increment completion count

### Main Tables

- `tests` - Test list
- `test_questions` - Questions
- `test_choices` - Choices
- `test_results` - Results
- `user_test_responses` - Responses
- `categories` - Categories
- `feedbacks` - Feedbacks
- `users` - Users

---

## Repository Etiquette

### Branch Naming

```
feature/TICKET-123-description
bugfix/TICKET-456-fix-name
hotfix/urgent-issue-fix
```

### Commit Messages

```
feat: Add feature
fix: Fix bug
docs: Update documentation
refactor: Refactor code
test: Add tests
chore: Build/config changes
```

### Merge Strategy

- Pull request required
- Tests must pass
- Lint/type check must pass

---

## "Do Not Touch" List

1. **Working legacy code rewrite prohibited** - Refactoring requires planning and separate work
2. **Supabase RLS policy modification prohibited** - Security issues may occur
3. **Database function arbitrary modification prohibited** - Cascading errors possible
4. **Global widgets (Sidebar/Footer) auto data hook calls prohibited** - Performance degradation
5. **Config files (self-config) arbitrary modification prohibited**
   - `turbo.json`
   - `package.json` (dependencies)
   - `tsconfig.json`
6. **Accessibility check skipping prohibited** - a11y attributes required
7. **TypeScript any type usage prohibited** - strict mode required
8. **Inline function usage prohibited** - handle prefix explicit declaration required
9. **Excessive try/catch prohibited** - Only meaningful error handling
10. **Package dependency arbitrary addition prohibited** - Must discuss first
11. **QueryKey hardcoding prohibited** - Must use centralized queryKeys
12. **Type file indiscriminate expansion prohibited** - Domain separation principle required

---

## Clean Code Principles

1. **Cohesion**: Place code with the same purpose close together
2. **Single Responsibility**: One function does one thing only
3. **Abstraction**: Extract core concepts, hide implementation details
4. **Readability First**: Clear variable names over brevity
5. **Early Return**: Minimize unnecessary nesting

```tsx
if (!user) return;
if (isLoading) return <Spinner />;
```

---

## Problem Solving Guide

### Type Errors

- Use `unknown` instead of `any`, then narrow types
- Interface uses `I` prefix, Type uses `T` prefix

### Performance Issues

- Check unnecessary re-renders
- Use useMemo/useCallback appropriately
- Avoid auto data calls in global widgets

### Supabase Errors

- Check RLS policies
- Verify column names specified
- Verify client/server separation

---

Following these rules maintains a consistent and maintainable codebase.

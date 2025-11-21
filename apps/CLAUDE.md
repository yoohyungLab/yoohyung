# YAAAARRRR111! - Pickid 프로젝트 Claude AI 가이드

## 프로젝트 개요

**Pickid**는 Monorepo 기반의 테스트/심리 진단 플랫폼입니다.

- Web: Next.js 15.5.2 (FSD + MVVM 패턴)
- Admin: Vite 7.1.7 (Layered 아키텍처)
- Backend: Supabase
- Package Manager: pnpm 9.12.0

---

## 기술 스택

### Frontend

- **Next.js**: 15.5.2 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.x
- **Vite**: 7.1.7 (Admin 앱)
- **Tailwind CSS**: 3.4.17
- **shadcn/ui**: UI 컴포넌트 라이브러리

### State Management

- **TanStack Query**: 5.90.2 (서버 상태)
- **Zustand**: 5.0.5 (클라이언트 상태, 최소화)

### Forms & Validation

- **React Hook Form**: 7.51.0+
- **Zod**: 3.23.8+ (스키마 검증)

### Backend

- **Supabase**: 2.40.7+ (서버, 클라이언트 분리)
- **RLS**: Row Level Security 활성화

### Testing

- **Jest**: 30.2.0
- **React Testing Library**: 16.3.0+
- **Lighthouse CI**: 0.12.0 (성능 모니터링)

### Build Tools

- **Turbo**: 2.0.0 (Monorepo 빌드 시스템)
- **Turborepo**: 워크스페이스 관리

---

## 프로젝트 구조

### Monorepo 루트

```
/
├── apps/
│   ├── web/          # Next.js 웹 앱 (FSD + MVVM)
│   └── admin/         # Vite 관리자 앱 (Layered)
├── packages/
│   ├── ui/           # 공통 UI 컴포넌트 (shadcn/ui)
│   ├── supabase/      # 데이터 접근 레이어
│   ├── shared/        # 공통 유틸리티/훅
│   ├── types/         # 공통 타입 정의
│   └── config/        # 공통 설정
├── supabase/
│   └── migrations/    # DB 마이그레이션
└── package.json
```

### Web 앱 구조 (apps/web) - FSD + MVVM

```
src/
├── app/               # Next.js App Router (페이지)
├── features/          # Feature-Sliced Design
│   └── [feature]/
│       ├── ui/        # View (프레젠테이션)
│       └── hooks/     # ViewModel (로직/상태)
├── shared/
│   ├── api/services/  # Data Access (Supabase 호출)
│   ├── lib/           # 공용 유틸
│   ├── hooks/         # 공용 훅
│   └── types/         # 공용 타입
└── widgets/           # 전역 위젯
```

### Admin 앱 구조 (apps/admin) - Layered

```
src/
├── pages/             # Presentation
├── components/        # Presentation
├── hooks/             # Business Logic
├── shared/
│   ├── api/services/  # Data Access
│   └── lib/           # Infrastructure
└── types/
```

---

## 명령어

### 개발

```bash
# 모든 앱 개발 서버 실행
pnpm dev

# 특정 앱만 실행 (자동 감지)
cd apps/web && pnpm dev
```

### 빌드

```bash
# 모든 앱 빌드
pnpm build

# 특정 앱만 빌드
cd apps/web && pnpm build
```

### 테스트

```bash
# 모든 테스트 실행
pnpm test

# 특정 앱 테스트
cd apps/web && pnpm test

# Watch 모드
pnpm test:watch

# 커버리지
pnpm test:coverage
```

### 린팅 & 타입 체크

```bash
pnpm lint
pnpm type-check
```

### Supabase 타입 생성

```bash
# 프로덕션
pnpm types

# 로컬
pnpm types-local
```

### 변경사항 & 버전 관리

```bash
pnpm changeset        # 변경사항 기록
pnpm version-packages # 버전 업데이트
pnpm release          # 배포
```

---

## 코드 스타일 및 규칙

### 아키텍처 패턴

#### Web (FSD + MVVM)

- **View**: `features/*/ui` - UI 렌더링만 담당
- **ViewModel**: `features/*/hooks` - 상태/로직 처리
- **Data**: `shared/api/services` - Supabase 호출
- **유틸**: `shared/lib|hooks|types` - 공용 요소

#### Admin (Layered)

```
Pages/Components → hooks → shared/api/services → shared/lib
```

- Presentation → Business → Data → Infrastructure

### TypeScript 네이밍

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

### 컴포넌트 Props 규칙

```ts
// 3개 이하: 구조분해 할당
const Component = ({title, color, size}: Props) => {...}

// 4개 이상: props 변수 사용
const Component = (props: Props) => {
  const {title, color, size, fullWidth, isVisible, onClick} = props;
  ...
}
```

### 이벤트 핸들러 네이밍

```ts
// handle prefix 필수
const handleHomeMove = () => {
	location.href = '/home';
};

// 인라인 함수 금지
// ❌ Bad: onClick={() => location.href = '/home'}
// ✅ Good: onClick={handleHomeMove}
```

### 함수 규칙

```tsx
// useEffect 내 함수
useEffect(() => {
  // 재사용 함수는 외부 선언
  const fetchData = async () => {...};

  // 일회성 함수는 즉시 호출
  (async () => {
    await loadInitialData();
  })();

  fetchData();
}, []);
```

### Import 구문

```ts
// 구조분해 할당 선호
import { Button, Dialog } from '@pickid/ui';
import { getUser, getTests } from '@/shared/api/services';

// 전체 import는 피하되, 필요한 경우만
import * as utils from '@/shared/lib/utils';
```

### Import 순서 규칙 (Boolti-web 참고)

```tsx
// 1. React 및 외부 라이브러리
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// 2. Monorepo 패키지 (@pickid/*)
import { Button, Dialog } from '@pickid/ui';
import { supabase } from '@pickid/supabase';
import type { Test, TestResult } from '@pickid/supabase';

// 3. 내부 API/Type/Constant
import { queryKeys } from '@/shared/api/query-keys';
import { testService } from '@/shared/api/services/test.service';
import type { ITestCard, TTestType } from '@/shared/types';
import { HREF, TEST_TYPES } from '@/shared/constants';

// 4. 내부 Hooks/Utils
import { useAuth } from '@/features/auth/hooks/use-auth';
import { formatDate, cn } from '@/shared/lib/utils';

// 5. 로컬 컴포넌트/파일
import { TestCard } from './test-card';
import * as S from './style';
```

### Styled Components

```tsx
// 파일: style.ts
import * as S from './style';

<S.Container $size="lg" $variant="primary">
	<S.Button onClick={handleClick}>버튼</S.Button>
</S.Container>;

// Styled Props: $ prefix 사용
```

### 주석 규칙

```ts
// 비자명한 의도/경계만 주석 작성
// 과도한 주석 금지, 코드 자체가 문서가 되어야 함
```

---

## 데이터 패칭 규칙

### SSR (서버 컴포넌트)

- ✅ SEO/초기 페인트가 중요한 리스트/상세
- ✅ 정적/반정적 데이터 (캐시 가능)
- 페이지 서버 컴포넌트에서 SSR → 클라이언트 View로 props 전달

### CSR (클라이언트)

- ✅ 정렬/필터/상호작용 상태
- ✅ 세션 의존 유저 데이터
- TanStack Query는 refetch/액션에만 사용

### State Management

```ts
// 서버 상태: TanStack Query
const { data, isLoading } = useQuery({
	queryKey: ['entity', subKey],
	queryFn: getEntity,
	staleTime: 5 * 60 * 1000, // 5분
});

// 클라이언트 상태: Zustand (최소화)
const { openDialog, closeDialog } = useDialogStore();
```

---

## QueryKey 관리 (중요!)

### 현재 패턴 (개선 대상)

```ts
// ❌ 각 hook에서 개별 정의
const { data } = useQuery({
	queryKey: ['test', testId],
	queryFn: () => testService.getTest(testId),
});

const { data } = useQuery({
	queryKey: ['published-tests'],
	queryFn: () => testService.getPublishedTests(),
});
```

**문제점:**

- QueryKey가 여러 파일에 분산되어 중복/오타 위험
- 타입 안전성 부족
- Prefetch/Invalidate 시 키 관리 어려움

### 권장 패턴 (도입 검토)

**Option 1: Query Key Factory 패턴** (Boolti-web 참고)

```ts
// shared/api/query-keys.ts
import { createQueryKeys, mergeQueryKeys } from '@lukemorales/query-key-factory';

// 도메인별 queryKey 그룹 정의
export const testQueryKeys = createQueryKeys('test', {
	list: {
		queryKey: null,
		queryFn: () => testService.getPublishedTests(),
	},
	detail: (testId: string) => ({
		queryKey: [testId],
		queryFn: () => testService.getTestWithDetails(testId),
	}),
	results: (testId: string) => ({
		queryKey: [testId],
		queryFn: () => testService.getTestResults(testId),
	}),
});

export const userQueryKeys = createQueryKeys('user', {
	profile: {
		queryKey: null,
		queryFn: () => userService.getProfile(),
	},
	responses: (userId: string) => ({
		queryKey: [userId],
		queryFn: () => userService.getUserResponses(userId),
	}),
});

// 중앙 집중화
export const queryKeys = mergeQueryKeys(testQueryKeys, userQueryKeys);
```

**사용 예시:**

```ts
// Hook
export function useTestDetail(testId: string) {
	return useQuery(queryKeys.test.detail(testId));
}

// Prefetch
queryClient.prefetchQuery(queryKeys.test.detail(testId));

// Invalidate
queryClient.invalidateQueries({ queryKey: queryKeys.test.list.queryKey });
```

**Option 2: Simple Factory 패턴** (가벼운 대안)

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

**사용 예시:**

```ts
// Hook
const { data } = useQuery({
	queryKey: queryKeys.test.detail(testId),
	queryFn: () => testService.getTestWithDetails(testId),
});

// Invalidate 패턴
queryClient.invalidateQueries({ queryKey: queryKeys.test.all }); // 모든 test 쿼리
queryClient.invalidateQueries({ queryKey: queryKeys.test.detail(testId) }); // 특정 detail만
```

### QueryKey 네이밍 규칙

- **도메인 기반 그룹핑**: `test`, `user`, `category`, `feedback` 등
- **계층 구조**: `all` → `list/detail` → `specific`
- **일관성**: 모든 queryKey는 중앙에서 관리

### TanStack Query 기본 설정

```ts
// app/providers.tsx 또는 QueryClientProvider
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5분 (현재 유지)
			refetchOnWindowFocus: false, // 추가 권장
			retry: false, // 추가 권장 (또는 1-2회)
			// useErrorBoundary: true, // Error Boundary 사용 시
		},
		mutations: {
			retry: false,
		},
	},
});
```

---

## Supabase 사용 규칙

### 클라이언트 생성

```ts
// 브라우저 (클라이언트)
import { supabase } from '@pickid/supabase';
const { data } = await supabase.from('table').select('*');

// 서버 (SSR)
import { createServerClient } from '@pickid/supabase';
const supabase = createServerClient();
const { data } = await supabase.from('table').select('id, name'); // 컬럼 명시!
```

### RLS (Row Level Security)

- SELECT 범위 최소화 + 컬럼 명시
- RLS 정책 항상 활성화
- 민감 데이터는 절대 클라이언트 RPC/권한 확대 금지

### Auth

```ts
// 클라이언트에서만 supabase.auth.* 사용
const {
	data: { user },
} = await supabase.auth.getUser();
```

---

## UI 컴포넌트 규칙

### shadcn/ui 사용

```tsx
// packages/ui 컴포넌트 사용
import { Button, Dialog, Drawer } from '@pickid/ui';

// 접근성 준수
<Dialog>
	<DialogContent aria-describedby="description">
		<DialogTitle>제목</DialogTitle>
		<DialogDescription id="description">설명</DialogDescription>
	</DialogContent>
</Dialog>;
```

### 성능 최적화

- 이미지: `next/image`, 주요 이미지 `priority` 조건부 설정
- 리스트 정렬: 클라이언트 메모이제이션 (`useMemo`)
- 불필요한 병렬 패칭 금지 (특히 전역 위젯)

---

## Constants 구조화

### 현재 구조

```
apps/
├── web/src/shared/constants/
│   └── index.ts              # FEEDBACK_CATEGORIES, FEEDBACK_STATUS
├── admin/src/constants/
│   └── test.constants.ts     # TEST_TYPES, CATEGORIES, DEFAULT_*
└── admin/src/shared/lib/constants/
    ├── options.ts            # 옵션 데이터
    └── filters.ts            # 필터 옵션
```

### 권장 구조 (Boolti-web 참고)

```
shared/constants/
├── index.ts                  # Barrel export
├── routes.ts                 # 라우트 경로 + HREF 생성 함수
├── feedback.ts               # 피드백 관련 상수
├── test.ts                   # 테스트 관련 상수
├── categories.ts             # 카테고리 데이터
└── theme.ts                  # 테마/색상 상수
```

### Routes 패턴 (추가 권장)

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

// HREF 생성 함수
export const HREF = {
	TEST_DETAIL: (testId: string) => `/tests/${testId}`,
	TEST_RESULT: (testId: string) => `/tests/${testId}/result`,
	ADMIN_TEST_EDIT: (testId: string) => `/admin/test/${testId}/edit`,
} as const;

// 사용 예시
import { HREF } from '@/shared/constants/routes';

router.push(HREF.TEST_DETAIL(testId));
// ✅ 타입 안전, 중복 방지, 리팩토링 용이
```

### Constants 네이밍 규칙

- **객체 상수**: `UPPER_SNAKE_CASE` (예: `TEST_TYPE_VALUES`)
- **함수**: `camelCase` (예: `createAppScheme`)
- **as const 필수**: 타입 좁히기를 위해 항상 사용

---

## Type 관리 (개선 권장)

### 현재 패턴

```
shared/types/
└── index.ts                  # 모든 타입 (270+ 줄)
```

**문제점:**

- 단일 파일에 모든 타입 집중 → 유지보수 어려움
- 도메인 경계 불명확
- Import 시 불필요한 타입까지 로드

### 권장 구조 (Boolti-web 참고)

```
shared/types/
├── index.ts                  # Barrel export
├── common.ts                 # 공통 타입 (Status, PageResponse 등)
├── test.ts                   # 테스트 관련 타입
├── test-result.ts            # 결과 관련 타입
├── user.ts                   # 사용자 관련 타입
├── auth.ts                   # 인증 관련 타입
├── balance-game.ts           # 밸런스 게임 타입
└── feedback.ts               # 피드백 타입
```

### 도메인별 Type 분리 예시

```ts
// shared/types/common.ts
export type TStatus = 'active' | 'inactive' | 'pending';

export interface IPageResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
}

// shared/types/test.ts
import type { Test } from '@pickid/supabase';

export type TTestType = 'balance' | 'psychology' | 'quiz';
export type TTestStatus = 'draft' | 'published' | 'scheduled';

export interface ITestCard extends Pick<Test, 'id' | 'title' | 'thumbnail_url'> {
	category: string;
	participantCount: number;
}

// shared/types/auth.ts
import type { User, Session } from '@supabase/supabase-js';

export interface IAuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
}

// shared/types/index.ts - Barrel export
export * from './common';
export * from './test';
export * from './test-result';
export * from './user';
export * from './auth';
export * from './balance-game';
export * from './feedback';
```

### Type 네이밍 규칙 (유지)

- **Interface**: `I` prefix (`IUserInfo`, `ITestCard`)
- **Type**: `T` prefix (`TUserRole`, `TTestType`)
- **Enum**: `E` prefix (`EUserStatus`)

### Type Import 규칙

```ts
// ✅ 명확한 import
import type { ITestCard, TTestType } from '@/shared/types/test';

// ✅ 여러 도메인 타입 사용 시
import type { ITestCard } from '@/shared/types/test';
import type { IUserProfile } from '@/shared/types/user';

// ✅ Barrel export 사용 (편의성)
import type { ITestCard, IUserProfile } from '@/shared/types';
```

---

## 서비스 레이어 규칙

### Services (shared/api/services/\*)

```ts
// 순수 호출만 정의
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

### Hook 사용

- 훅에서만 서비스 호출
- 컴포넌트는 훅만 사용

```ts
// Hook (queryKey factory 사용 시)
export function useEntity(id: string) {
	return useQuery(queryKeys.entity.detail(id));
}

// Hook (simple factory 사용 시)
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

## 핵심 파일 및 유틸리티

### 중요 파일

- `apps/web/src/middleware.ts` - 라우트 보호 미들웨어
- `packages/supabase/src/index.ts` - Supabase 클라이언트
- `packages/ui/src/components/` - 공통 UI 컴포넌트
- `supabase/migrations/` - 데이터베이스 마이그레이션

### 데이터베이스 함수

- `get_dashboard_stats()` - 대시보드 통계
- `get_top_tests_today(limit)` - 인기 테스트
- `is_admin_user()` - 관리자 권한 확인
- `increment_test_start(test_uuid)` - 시작 횟수 증가
- `increment_test_response(test_uuid)` - 완료 횟수 증가

### 주요 테이블

- `tests` - 테스트 목록
- `test_questions` - 질문
- `test_choices` - 선택지
- `test_results` - 결과
- `user_test_responses` - 응답
- `categories` - 카테고리
- `feedbacks` - 피드백
- `users` - 사용자

---

## 저장소 에티켓

### 브랜치 네이밍

```
feature/TICKET-123-description
bugfix/TICKET-456-fix-name
hotfix/urgent-issue-fix
```

### 커밋 메시지

```
feat: 기능 추가
fix: 버그 수정
docs: 문서 수정
refactor: 리팩토링
test: 테스트 추가
chore: 빌드/설정 변경
```

### 병합 전략

- 풀 리퀘스트 필수
- 테스트 통과 확인
- Lint/타입 체크 통과 확인

---

## "절대 건드리지 마시오" 목록

### 건드리면 안 되는 것

1. **작동하는 레거시 코드 재작성 금지** - 리팩토링은 기획 후 별도 작업
2. **Supabase RLS 정책 수정 금지** - 보안 이슈 발생 가능
3. **데이터베이스 함수 임의 수정 금지** - 연쇄 오류 가능
4. **전역 위젯(Sidebar/Footer)에서 데이터 훅 자동 호출 금지** - 성능 저하
5. **설정 파일(self-config) 임의 수정 금지**
   - `turbo.json`
   - `package.json` (dependencies)
   - `tsconfig.json`
6. **접근성 검사 건너뛰기 금지** - a11y 속성 필수
7. **TypeScript any 타입 사용 금지** - strict 모드 필수
8. **인라인 함수 사용 금지** - handle prefix 명시적 선언 필요
9. **과도한 try/catch 금지** - 의미있는 에러 처리만
10. **패키지 의존성 임의 추가 금지** - 먼저 공유 필요
11. **QueryKey 하드코딩 금지** - queryKeys 중앙 관리 사용 필수
12. **Type 파일 무분별한 확장 금지** - 도메인별 분리 원칙 준수

---

## 클린 코드 원칙

### 1. 응집도 (Cohesion)

같은 목적의 코드는 가깝게 배치

```tsx
// ✅ Good
function QuestionPage() {
	const [openPopup] = usePopup();

	async function handleClick() {
		const confirmed = await openPopup({
			title: '질문 등록',
			contents: <QuestionForm />,
		});
		if (confirmed) await submitQuestion();
	}

	return <Button onClick={handleClick}>질문 등록</Button>;
}
```

### 2. 단일 책임 (Single Responsibility)

하나의 함수는 하나의 일만 수행

```tsx
// ✅ Good
function validateUserCredentials() {}
function handleLoginSuccessRedirect() {}
```

### 3. 추상화 (Abstraction)

핵심 개념 추출, 세부 구현 숨김

```tsx
openPopup({ title: '삭제 확인', onConfirm: deletePost });

async function deletePost() {
	await api.deletePost(id);
	refresh();
}
```

### 4. 가독성 우선

변수명은 명확하게, 짧기보다 이해하기 쉽게

### 5. Early Return

불필요한 중첩 최소화

```tsx
if (!user) return;
if (isLoading) return <Spinner />;
```

---

## 성능 최적화

### 이미지

```tsx
<Image src="/image.jpg" alt="..." width={800} height={600} priority={isAboveFold} />
```

### 리스트 정렬

```tsx
const sortedList = useMemo(() => {
	return items.sort((a, b) => a.order - b.order);
}, [items]);
```

### 불필요한 패칭 방지

- 전역 위젯에서 자동 데이터 호출 금지
- Drawer/Dialog 열릴 때만 데이터 로드

---

## 테스트 작성

### 테스트 파일 위치

```
src/
├── components/
│   └── Button/
│       ├── Button.tsx
│       └── Button.test.tsx  # 컴포넌트 옆에
```

### 테스트 예시

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
	it('renders correctly', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});
});
```

---

## 추가 규칙

### 로딩/에러 상태

모든 비동기 작업에 로딩/에러 상태 구현 필수

### Form 처리

React Hook Form + Zod 스키마
UI는 packages/ui의 input/select/textarea 사용

### 다이얼로그/Drawer

shadcn 컴포넌트 우선
a11y 속성 준수

---

## 문제 해결 가이드

### 타입 에러

1. `any` 대신 `unknown` 사용 후 타입 좁히기
2. Interface는 `I` prefix, Type은 `T` prefix

### 성능 이슈

1. 불필요한 re-render 확인
2. useMemo/useCallback 적절히 사용
3. 병렬 패칭 최소화

### Supabase 에러

1. RLS 정책 확인
2. 컬럼명 명시 확인
3. 클라이언트/서버 분리 확인

---

## 마이그레이션 가이드

### 우선순위별 적용 순서

#### Phase 1: 즉시 적용 (Breaking Changes 없음)

1. **TanStack Query 설정 개선**

   ```ts
   // app/providers.tsx
   const queryClient = new QueryClient({
   	defaultOptions: {
   		queries: {
   			staleTime: 5 * 60 * 1000,
   			refetchOnWindowFocus: false, // 추가
   			retry: false, // 추가
   		},
   	},
   });
   ```

2. **Import 순서 정리**
   - 기존 코드 동작 변경 없음
   - ESLint rule로 강제 가능

#### Phase 2: 점진적 적용 (새 코드부터)

1. **QueryKey Factory 도입**

   ```bash
   # Option 1: 라이브러리 사용
   pnpm add @lukemorales/query-key-factory

   # Option 2: Simple Factory (설치 불필요)
   # shared/api/query-keys.ts 생성
   ```

   - 새로운 hook부터 queryKeys 사용
   - 기존 hook은 점진적으로 마이그레이션

2. **Routes Constants 추가**

   ```ts
   // shared/constants/routes.ts 생성
   export const PATH = { ... };
   export const HREF = { ... };
   ```

   - 새로운 navigation부터 HREF 사용
   - 기존 하드코딩된 경로는 점진적 교체

#### Phase 3: 리팩토링 (별도 작업)

1. **Type 파일 분리**

   - `shared/types/index.ts` → 도메인별 파일로 분리
   - Breaking change 가능성 있음
   - 별도 PR로 진행

2. **Constants 재구조화**
   - 기존 constants 파일들 정리
   - 도메인별 분리
   - 별도 PR로 진행

### 예상 효과

- ✅ **QueryKey 관리**: 중복/오타 방지, 타입 안전성 향상
- ✅ **Type 분리**: 파일 크기 감소, 유지보수성 향상
- ✅ **Constants 구조화**: 경로 관리 일관성, 리팩토링 용이성
- ✅ **Import 순서**: 코드 가독성 향상

---

## 빠른 참조 (Cheat Sheet)

### QueryKey 패턴

```ts
// ❌ Bad
queryKey: ['test', testId];

// ✅ Good (Simple Factory)
queryKey: queryKeys.test.detail(testId);
```

### Routes 패턴

```ts
// ❌ Bad
router.push(`/tests/${testId}`);

// ✅ Good
router.push(HREF.TEST_DETAIL(testId));
```

### Type Import 패턴

```ts
// ✅ Good
import type { ITestCard, TTestType } from '@/shared/types/test';
```

### Import 순서

```ts
// 1. 외부 라이브러리
// 2. Monorepo 패키지 (@pickid/*)
// 3. 내부 API/Type/Constant
// 4. 내부 Hooks/Utils
// 5. 로컬 컴포넌트/파일
```

---

## 주요 개선 사항 요약 (Boolti-web 참고)

| 항목              | 현재                      | 개선 방향                    | 우선순위 |
| ----------------- | ------------------------- | ---------------------------- | -------- |
| **QueryKey 관리** | 각 hook에서 개별 정의     | queryKeys 중앙 집중화        | HIGH     |
| **Routes**        | 하드코딩 경로             | HREF 생성 함수 패턴          | MEDIUM   |
| **Type 구조**     | 단일 파일 (270+ 줄)       | 도메인별 파일 분리           | MEDIUM   |
| **Constants**     | 일부 분리됨               | 체계적 도메인별 분리         | LOW      |
| **Query 설정**    | staleTime만 설정          | refetchOnWindowFocus 등 추가 | HIGH     |
| **Import 순서**   | 규칙 없음                 | 명확한 순서 규칙             | LOW      |

---

이 규칙들을 따르면 일관되고 유지보수 가능한 코드베이스를 유지할 수 있습니다. 🚀

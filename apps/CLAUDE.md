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
// Hook
export function useEntity(id: string) {
	return useQuery({
		queryKey: ['entity', id],
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

이 규칙들을 따르면 일관되고 유지보수 가능한 코드베이스를 유지할 수 있습니다. 🚀

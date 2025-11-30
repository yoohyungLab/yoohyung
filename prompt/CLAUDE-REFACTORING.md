# Frontend Refactoring Guide

> 이 문서는 코드 리팩토링 시 참고하는 가이드입니다.
> 일반적인 컨벤션은 `CLAUDE.md`를 참고하세요.

## 리팩토링의 4가지 핵심 원칙

### 1. 선언적 프로그래밍

**무엇을 하는지 명확하게 표현**

```tsx
// ❌ Bad - 어떻게 하는지에 집중
function QuestionPage() {
  const [popupOpened, setPopupOpened] = useState(false);

  async function handleClick() {
    const user = await fetchUser();
    if (!user) {
      await showLoginPopup();
    }
    await submitQuestion(questionValue);
    alert("질문이 전송되었습니다.");
  }

  return (
    <main>
      <form>
        <textarea placeholder="질문을 입력하세요" />
        <button onClick={handleClick}>질문하기</button>
      </form>
      {popupOpened && <LoginPopup />}
    </main>
  );
}

// ✅ Good - 무엇을 하는지 명확하게
function QuestionPage() {
  const user = useFetch(fetchUser);

  async function handleNewQuestion() {
    await submitQuestion(questionValue);
    alert("질문이 전송되었습니다.");
  }

  async function handleMyExpertQuestion() {
    await submitExpertQuestion(questionValue, expert.id);
    alert(`${expert.name}에게 질문이 전송되었습니다.`);
  }

  return (
    <main>
      <form>
        <textarea placeholder="질문을 입력하세요" />
        {user.connected ? (
          <PopupTriggerButton
            popup={<ExpertPopup onSubmit={handleMyExpertQuestion} />}
          >
            질문하기
          </PopupTriggerButton>
        ) : (
          <Button onClick={handleNewQuestion}>질문하기</Button>
        )}
      </form>
    </main>
  );
}
```

### 2. 액션과 계산 분리

**부수효과가 있는 함수(액션)와 순수 함수(계산) 분리**

```tsx
// ❌ Bad - 액션과 계산이 섞여있음
async function handleSubmit() {
  const user = await fetchUser();  // 액션 (API 호출)
  if (!user) {
    await showLoginPopup();  // 액션
  }
  await submitQuestion(questionValue);  // 액션
  alert("질문이 전송되었습니다.");  // 액션

  const expert = await fetchExpert();  // 액션
  if (expert !== null) {
    await submitExpertQuestion(questionValue);  // 액션
    alert(`${expert.name}에게 질문이 전송되었습니다.`);  // 액션
  }
}

// ✅ Good - 액션과 계산을 명확히 분리
// 액션: API 호출, 팝업 등 부수효과
async function handleNewExpertQuestion() {
  await submitExpertQuestion(questionValue);
  alert(`${expert.name}에게 질문이 전송되었습니다.`);
}

// 액션: 새로운 질문 제출
async function handleNewQuestion() {
  await submitQuestion(questionValue);
  alert("질문이 전송되었습니다.");
}

// 액션: 로그인 확인 및 팝업
async function openPopupToNotAgreedUsers() {
  const user = await fetchUser();
  if (!user) {
    await showLoginPopup();
  }
}
```

### 3. 추상화 레벨 맞추기

**한 함수 내에서는 동일한 추상화 레벨 유지**

```tsx
// ❌ Bad - 추상화 레벨이 섞여있음
async function handleSubmit() {
  const user = await fetchUser();  // Low level
  if (!user) {
    await showLoginPopup();  // Low level
  }
  await submitQuestion(questionValue);  // High level
  alert("질문이 전송되었습니다.");  // Low level
}

// ✅ Good - 동일한 추상화 레벨
async function handleSubmit() {
  await checkLoginStatus();  // High level
  await submitQuestion();     // High level
  showSuccessMessage();      // High level
}

// 각각의 함수는 낮은 레벨의 구현을 감춤
async function checkLoginStatus() {
  const user = await fetchUser();
  if (!user) {
    await showLoginPopup();
  }
}

async function submitQuestion() {
  await submitQuestionAPI(questionValue);
}

function showSuccessMessage() {
  alert("질문이 전송되었습니다.");
}
```

### 4. Early Return

**불필요한 중첩 제거**

```tsx
// ❌ Bad - 깊은 중첩
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return doSomething(user);
      } else {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

// ✅ Good - Early Return
function processUser(user) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;

  return doSomething(user);
}
```

---

## 컴포넌트 리팩토링 패턴

### 1. 한 가지 일만 하는 컴포넌트

```tsx
// ❌ Bad - 여러 책임을 가진 컴포넌트
function QuestionPage() {
  const [popupOpened, setPopupOpened] = useState(false);

  async function handleClick() {
    setPopupOpened(true);
  }

  function handlePopupSubmit() {
    await submitQuestion(expert.id);
    alert("질문이 전송되었습니다.");
  }

  return (
    <>
      <button onClick={handleClick}>질문하기</button>
      <Popup title="전문가 질문하기" open={popupOpened}>
        <div>전문가에게 질문하세요</div>
        <button onClick={handlePopupSubmit}>확인</button>
      </Popup>
    </>
  );
}

// ✅ Good - 단일 책임
function QuestionPage() {
  const [openPopup] = usePopup();

  async function handleClick() {
    const confirmed = await openPopup({
      title: "전문가 질문하기",
      contents: <div>전문가에게 질문하세요</div>,
    });

    if (confirmed) {
      await submitQuestion();
    }
  }

  return <button onClick={handleClick}>질문하기</button>;
}
```

### 2. 명확한 함수 네이밍

```tsx
// ❌ Bad - 모호한 함수명
async function handleQuestionSubmit() {
  const user = await fetchUser();
  if (!user) {
    await showLoginPopup();
  }
  await submitQuestion(questionValue);
  alert("질문이 전송되었습니다.");
}

// ✅ Good - 구체적인 함수명
async function handleNewQuestionSubmit() {
  await submitQuestion(questionValue);
  alert("질문이 전송되었습니다.");
}

async function handleExpertQuestionSubmit() {
  await submitExpertQuestion(questionValue, expert.id);
  alert(`${expert.name}에게 질문이 전송되었습니다.`);
}

async function handleLoginPopup() {
  const user = await fetchUser();
  if (!user) {
    await showLoginPopup();
  }
}
```

### 3. 조건부 렌더링 개선

```tsx
// ❌ Bad - 복잡한 조건부 렌더링
<div>
  {isLoading ? (
    <Spinner />
  ) : error ? (
    <Error message={error.message} />
  ) : data ? (
    <DataList items={data} />
  ) : (
    <EmptyState />
  )}
</div>

// ✅ Good - Early Return 활용
function DataSection() {
  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!data) return <EmptyState />;

  return <DataList items={data} />;
}
```

---

## 추상화 가이드

### 추상화는 언제?

**❌ 불필요한 추상화**
```tsx
// 한 곳에서만 사용되는 헬퍼 함수
function getUserLabel(user) {
  return user.isNew ? '신규 사용자' : '기존 사용자';
}

// 사용처가 명확한 경우 인라인으로
const label = user.isNew ? '신규 사용자' : '기존 사용자';
```

**✅ 필요한 추상화**
```tsx
// 여러 곳에서 사용되는 로직
function useUserLabel(userId) {
  const user = useQuery(['user', userId], () => fetchUser(userId));
  return user.isNew ? '신규 사용자' : '기존 사용자';
}

// 복잡한 비즈니스 로직
function calculateDiscount(user, product) {
  if (user.isPremium) return product.price * 0.8;
  if (user.isFirstTime) return product.price * 0.9;
  return product.price;
}
```

### 추상화 레벨

**Level 0: 모든 것을 컴포넌트에**
```tsx
<Button onClick={showConfirm}>
  제출
</Button>
{isShowConfirm && (
  <Confirm onClick={() => {showMessage("성공")}}/>
)}
```

**Level 1: 재사용 가능한 컴포넌트**
```tsx
<ConfirmButton
  onConfirm={() => {showMessage("성공")}}
>
  제출
</ConfirmButton>
```

**Level 2: 비즈니스 로직 추상화**
```tsx
<ConfirmButton message="성공">
  제출
</ConfirmButton>
```

**Level 3: 완전 추상화**
```tsx
<ConfirmButton />
```

> **주의**: Level 3은 대부분의 경우 과도한 추상화입니다.
> 상황에 맞는 적절한 추상화 레벨을 선택하세요.

---

## 상태 관리 리팩토리ng

### 불필요한 상태 제거

```tsx
// ❌ Bad - 파생 상태를 별도로 관리
const [users, setUsers] = useState([]);
const [activeUsers, setActiveUsers] = useState([]);

useEffect(() => {
  setActiveUsers(users.filter(u => u.isActive));
}, [users]);

// ✅ Good - 파생 상태는 계산으로
const [users, setUsers] = useState([]);
const activeUsers = useMemo(
  () => users.filter(u => u.isActive),
  [users]
);
```

### 로컬 상태 vs 전역 상태

```tsx
// ❌ Bad - 전역 상태 남용
const useGlobalStore = create((set) => ({
  isModalOpen: false,
  modalTitle: '',
  setModalOpen: (open) => set({ isModalOpen: open }),
  setModalTitle: (title) => set({ modalTitle: title }),
}));

// ✅ Good - 로컬 상태 우선
function MyComponent() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  // 전역 상태는 정말 필요한 경우만
  const { user } = useAuthStore();
}
```

---

## 실전 리팩토링 예제

### Before: 복잡한 컴포넌트

```tsx
function TestDetailPage() {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const data = await fetchTest(testId);
        setTest(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [testId]);

  async function handleStart() {
    const user = await fetchUser();
    if (!user) {
      setShowModal(true);
      return;
    }

    try {
      await incrementTestStart(testId);
      router.push(`/tests/${testId}/play`);
    } catch (err) {
      alert("오류가 발생했습니다.");
    }
  }

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!test) return <NotFound />;

  return (
    <div>
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <button onClick={handleStart}>시작하기</button>
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
```

### After: 리팩토링 적용

```tsx
// hooks/api/useTestQuery.ts
export function useTestQuery(testId: string) {
  return useQuery({
    queryKey: ['test', testId],
    queryFn: () => fetchTest(testId),
  });
}

// hooks/useTestStart.ts
export function useTestStart(testId: string) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  async function startTest() {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    await incrementTestStart(testId);
    router.push(`/tests/${testId}/play`);
  }

  return { startTest, showLoginModal, setShowLoginModal };
}

// components/TestDetailPage.tsx
function TestDetailPage() {
  const { data: test, isLoading, error } = useTestQuery(testId);
  const { startTest, showLoginModal, setShowLoginModal } = useTestStart(testId);

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  if (!test) return <NotFound />;

  return (
    <div>
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <button onClick={startTest}>시작하기</button>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
}
```

---

## 리팩토링 체크리스트

### 코드 리뷰 시 확인사항

- [ ] 함수는 한 가지 일만 하는가?
- [ ] 함수명이 하는 일을 명확히 설명하는가?
- [ ] 추상화 레벨이 일관적인가?
- [ ] Early Return을 활용했는가?
- [ ] 불필요한 중첩이 있는가?
- [ ] 액션과 계산이 분리되어 있는가?
- [ ] 파생 상태를 별도로 관리하고 있지 않은가?
- [ ] 전역 상태를 남용하고 있지 않은가?
- [ ] 컴포넌트가 너무 많은 책임을 가지고 있지 않은가?
- [ ] 추상화가 과도하거나 부족하지 않은가?

### 리팩토링 우선순위

1. **안전성**: 테스트가 있는 코드부터 리팩토링
2. **영향도**: 자주 변경되는 코드 우선
3. **복잡도**: 복잡한 코드일수록 우선
4. **중복도**: 중복이 많은 코드 우선

---

## 참고사항

- 리팩토링은 **기능 변경 없이** 코드 구조를 개선하는 것
- 한 번에 하나의 리팩토링만 수행
- 리팩토링 후 반드시 테스트 수행
- 과도한 추상화는 오히려 복잡도를 높임
- 실용주의: 완벽보다는 **개선**에 집중

---

# Pickid 프로젝트 컨벤션 가이드

> 이 섹션은 Pickid 프로젝트의 코드베이스 컨벤션을 정의합니다.
> 기존 코드와 일관성을 유지하기 위해 반드시 준수해야 합니다.

## 프로젝트 구조 컨벤션

### Web App (apps/web) - MVVM 패턴

```
apps/web/src/
├── app/                          # Next.js App Router
│   ├── (routes)/                # Route groups
│   │   ├── tests/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx    # Server Component
│   │   │   │   └── result/
│   │   │   │       └── page.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx             # Home page
│   ├── layout.tsx               # Root layout
│   └── providers.tsx            # Client providers
│
├── api/                          # API routes
│   └── services/                # Data Access Layer
│       ├── test.service.ts      # Test CRUD operations
│       ├── category.service.ts
│       └── index.ts
│
├── components/                   # Shared components
│   ├── layout/                  # Layout components
│   ├── ui/                      # UI primitives
│   └── shared/                  # Common components
│
├── features/                     # Feature modules (not used in current structure)
│
├── lib/                          # Utilities
│   ├── utils.ts
│   ├── api-client.ts
│   └── supabase.ts
│
├── types/                        # Type definitions
│   ├── test.ts
│   ├── category.ts
│   └── index.ts
│
└── constants/                    # Constants
    ├── routes.ts
    ├── test.ts
    └── index.ts
```

### Admin App (apps/admin) - Layered Architecture

```
apps/admin/src/
├── pages/                        # Page components
│   ├── dashboard/
│   │   └── dashboard-page.tsx
│   ├── tests/
│   │   ├── test-list-page.tsx
│   │   ├── create-test-page.tsx
│   │   └── edit-test-page.tsx
│   └── index.tsx
│
├── components/                   # UI components
│   ├── test/
│   │   ├── test-create/
│   │   │   ├── steps/          # Wizard steps
│   │   │   └── components/     # Step components
│   │   └── test-detail-modal.tsx
│   ├── ui/                      # Reusable UI
│   └── layout/                  # Layout components
│
├── hooks/                        # Business logic
│   ├── useTests.ts              # Test management hooks
│   ├── useCategories.ts
│   └── useFeedbacks.ts
│
├── services/                     # Data Access Layer
│   ├── test.service.ts
│   ├── category.service.ts
│   ├── analytics.service.ts
│   └── index.ts
│
├── types/                        # Type definitions
│   ├── test.types.ts
│   ├── category.types.ts
│   └── index.ts
│
├── constants/                    # Constants
│   └── test.ts
│
└── config/                       # Configuration
    └── navigation.ts
```

---

## 파일 네이밍 컨벤션

### 파일명 규칙

```bash
# Components - PascalCase
TestCard.tsx
TestDetailModal.tsx
CategoryCreateModal.tsx

# Hooks - camelCase with 'use' prefix
useTest.ts
useTestQuery.ts
useCreateTestMutation.ts

# Services - kebab-case with '.service' suffix
test.service.ts
category.service.ts
analytics.service.ts

# Types - kebab-case with '.types' suffix
test.types.ts
category.types.ts
user.types.ts

# Utilities - kebab-case
utils.ts
api-client.ts
image-preload.ts

# Constants - kebab-case
routes.ts
test.ts
home.ts
```

### 폴더 구조 규칙

```bash
# Feature 폴더 - kebab-case
test-create/
balance-game/
user-profile/

# Component 그룹 - kebab-case
test-list/
category-management/
analytics-stats/
```

---

## TypeScript 컨벤션

### 타입 네이밍

```typescript
// ✅ Good - Prefix 규칙 준수
// Interface: I prefix
interface ITestCard {
  id: string;
  title: string;
  type: TTestType;
}

// Type: T prefix
type TTestType = 'quiz' | 'balance-game' | 'personality';

// Enum: E prefix
enum ETestStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

// ❌ Bad - Prefix 없음
interface TestCard { }
type TestType = 'quiz';
enum TestStatus { }
```

### Props 타입 정의

```typescript
// ✅ Good - Component명 + Props
interface TestCardProps {
  test: ITestCard;
  onClick?: () => void;
}

// Component
export function TestCard({ test, onClick }: TestCardProps) {
  // ...
}

// ✅ Good - Inline props (3개 이하)
export function SimpleCard({ title, description, image }: {
  title: string;
  description: string;
  image: string;
}) {
  // ...
}

// ❌ Bad - Props 객체로 받으면서 타입 미지정
export function TestCard(props) {
  const { test, onClick } = props;
  // ...
}
```

### 타입 Import/Export

```typescript
// ✅ Good - Named export with 'type' keyword
export type { ITestCard, TTestType };
export interface ICategory { }

// ✅ Good - Type import
import type { ITestCard, TTestType } from '@/types/test';

// ❌ Bad - Default export for types
export default interface ITestCard { }
```

---

## Component 컨벤션

### Component 구조

```tsx
// ✅ Good - 명확한 구조
'use client'; // Client component인 경우만

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@pickid/ui';
import type { ITestCard } from '@/types/test';
import { testService } from '@/services/test.service';

interface TestCardProps {
  testId: string;
  onClick?: () => void;
}

export function TestCard({ testId, onClick }: TestCardProps) {
  // 1. Hooks
  const { data: test, isLoading } = useTestQuery(testId);
  const [isHovered, setIsHovered] = useState(false);

  // 2. Event handlers
  const handleClick = () => {
    onClick?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // 3. Early returns
  if (isLoading) return <Spinner />;
  if (!test) return null;

  // 4. Render
  return (
    <Card
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <h3>{test.title}</h3>
      <p>{test.description}</p>
    </Card>
  );
}

// ❌ Bad - 구조 없이 작성
export function TestCard({ testId }) {
  const test = useTestQuery(testId);
  return test.isLoading ? <Spinner /> : (
    <Card onClick={() => console.log(test.data?.id)}>
      <h3>{test.data?.title}</h3>
    </Card>
  );
}
```

### Event Handler 네이밍

```tsx
// ✅ Good - handle prefix + 구체적인 동작
const handleSubmit = async () => { };
const handleTestStart = () => { };
const handleCategorySelect = (id: string) => { };
const handleImageUpload = (file: File) => { };

// ❌ Bad - 모호한 네이밍
const onClick = () => { };
const submit = () => { };
const doSomething = () => { };

// ❌ Bad - Inline 함수
<button onClick={() => router.push('/test')}>Click</button>

// ✅ Good - Named 함수
const handleClick = () => router.push('/test');
<button onClick={handleClick}>Click</button>
```

---

## Data Fetching 컨벤션

### Service Layer

```typescript
// ✅ Good - services/test.service.ts
import { supabase } from '@pickid/supabase';

export const testService = {
  // 명확한 함수명
  async getTest(testId: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('id, title, description, type, category_id') // 필요한 컬럼만
      .eq('id', testId)
      .single();

    if (error) throw error;
    return data;
  },

  async getTests(params?: { category?: string; type?: string }) {
    let query = supabase
      .from('tests')
      .select('id, title, description, thumbnail_url, type')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (params?.category) {
      query = query.eq('category_id', params.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async createTest(data: ITestCreateDto) {
    const { data: test, error } = await supabase
      .from('tests')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return test;
  },
};

// ❌ Bad - 에러 처리 없음, select('*')
export async function getTest(id: string) {
  const { data } = await supabase
    .from('tests')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}
```

### TanStack Query Hooks

```typescript
// ✅ Good - hooks/useTestQuery.ts
import { useQuery } from '@tanstack/react-query';
import { testService } from '@/services/test.service';

export function useTestQuery(testId: string) {
  return useQuery({
    queryKey: ['test', testId],
    queryFn: () => testService.getTest(testId),
    enabled: !!testId,
  });
}

export function useTestsQuery(params?: { category?: string }) {
  return useQuery({
    queryKey: ['tests', params],
    queryFn: () => testService.getTests(params),
  });
}

// ✅ Good - Mutation
export function useCreateTestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ITestCreateDto) => testService.createTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
  });
}

// ❌ Bad - Service 직접 호출
function TestCard({ testId }) {
  const [test, setTest] = useState(null);

  useEffect(() => {
    testService.getTest(testId).then(setTest);
  }, [testId]);

  return <div>{test?.title}</div>;
}
```

---

## 상태 관리 컨벤션

### Local State

```typescript
// ✅ Good - 컴포넌트 내부 상태
function TestCard() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return <Card />;
}
```

### Global State (Zustand)

```typescript
// ✅ Good - stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IAuthStore {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Usage
function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button>Login</button>
      )}
    </header>
  );
}
```

---

## Error Handling 컨벤션

### Service Layer Error Handling

```typescript
// ✅ Good - Throw errors for hooks to catch
export const testService = {
  async getTest(testId: string) {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('id', testId)
      .single();

    if (error) throw error; // Let React Query handle it
    return data;
  },
};

// ❌ Bad - Silent error handling
export async function getTest(id: string) {
  try {
    const { data, error } = await supabase.from('tests').select('*');
    return data || null; // Error 무시
  } catch {
    return null;
  }
}
```

### Component Error Handling

```tsx
// ✅ Good - React Query error handling
function TestCard({ testId }: Props) {
  const { data: test, isLoading, error } = useTestQuery(testId);

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error.message} />;
  if (!test) return <NotFound />;

  return <Card>{test.title}</Card>;
}

// ✅ Good - Mutation error handling
function CreateTestForm() {
  const { mutate, isPending, error } = useCreateTestMutation();

  const handleSubmit = (data: ITestCreateDto) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('테스트가 생성되었습니다.');
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      {/* form fields */}
    </form>
  );
}
```

---

## Import 순서 컨벤션

```typescript
// ✅ Good - 4단계 순서
// 1. React & External libraries
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// 2. Monorepo packages (@pickid/*)
import { Button, Card, Dialog } from '@pickid/ui';
import { supabase } from '@pickid/supabase';
import type { Test, Category } from '@pickid/supabase';

// 3. Internal absolute imports (@/*)
import { testService } from '@/services/test.service';
import type { ITestCard } from '@/types/test';
import { ROUTES } from '@/constants/routes';

// 4. Relative imports
import { TestCard } from './TestCard';
import { useTest } from '../hooks/useTest';
```

---

## 실전 패턴 예제

### MVVM Pattern 구현

```typescript
// ViewModel: hooks/useTestDetail.ts
export function useTestDetail(testId: string) {
  const router = useRouter();
  const { data: test, isLoading } = useTestQuery(testId);
  const { mutate: incrementStart } = useIncrementStartMutation();

  const handleStart = () => {
    incrementStart(testId);
    router.push(`/tests/${testId}/play`);
  };

  return {
    test,
    isLoading,
    handleStart,
  };
}

// View: components/TestDetailPage.tsx
export function TestDetailPage({ testId }: Props) {
  const { test, isLoading, handleStart } = useTestDetail(testId);

  if (isLoading) return <Spinner />;
  if (!test) return <NotFound />;

  return (
    <div>
      <h1>{test.title}</h1>
      <p>{test.description}</p>
      <button onClick={handleStart}>시작하기</button>
    </div>
  );
}
```

### 재사용 가능한 Hook 패턴

```typescript
// ✅ Good - 제네릭 활용
function usePagination<T>(
  fetchFn: (page: number) => Promise<T[]>,
  pageSize: number = 20
) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['paginated', page],
    queryFn: () => fetchFn(page),
  });

  const nextPage = () => setPage((p) => p + 1);
  const prevPage = () => setPage((p) => Math.max(1, p - 1));

  return { data, isLoading, page, nextPage, prevPage };
}

// Usage
function TestList() {
  const { data: tests, page, nextPage, prevPage } = usePagination(
    (page) => testService.getTests({ page })
  );

  return (
    <div>
      {tests?.map(test => <TestCard key={test.id} test={test} />)}
      <Pagination page={page} onNext={nextPage} onPrev={prevPage} />
    </div>
  );
}
```

---

## 금지 패턴

### ❌ 절대 하지 말아야 할 것들

```typescript
// ❌ any 사용
function processData(data: any) {
  return data.value;
}

// ✅ unknown 사용 후 타입 가드
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value;
  }
  throw new Error('Invalid data');
}

// ❌ Inline 함수
<button onClick={() => router.push('/test')}>Click</button>

// ✅ Named 함수
const handleClick = () => router.push('/test');
<button onClick={handleClick}>Click</button>

// ❌ select('*')
const { data } = await supabase.from('tests').select('*');

// ✅ 필요한 컬럼만
const { data } = await supabase
  .from('tests')
  .select('id, title, description');

// ❌ 컴포넌트 내부에서 직접 API 호출
function TestCard({ testId }) {
  const [test, setTest] = useState(null);

  useEffect(() => {
    fetch(`/api/tests/${testId}`)
      .then(res => res.json())
      .then(setTest);
  }, [testId]);

  return <div>{test?.title}</div>;
}

// ✅ Service Layer + Hook 사용
function TestCard({ testId }: Props) {
  const { data: test } = useTestQuery(testId);
  return <div>{test?.title}</div>;
}
```

---

## 체크리스트

리팩토링 또는 새 코드 작성 시 확인:

- [ ] 파일명이 컨벤션을 따르는가? (PascalCase/camelCase/kebab-case)
- [ ] 타입에 올바른 prefix가 있는가? (I/T/E)
- [ ] Import 순서가 올바른가? (4단계)
- [ ] Event handler에 handle prefix가 있는가?
- [ ] 인라인 함수 대신 named 함수를 사용했는가?
- [ ] Service layer에서 에러를 throw하는가?
- [ ] Supabase query에서 필요한 컬럼만 select하는가?
- [ ] any 타입을 사용하지 않았는가?
- [ ] Early return 패턴을 사용했는가?
- [ ] MVVM 패턴을 준수했는가? (View/ViewModel 분리)

---

## 마무리

이 컨벤션 가이드는 Pickid 프로젝트의 코드 품질과 일관성을 유지하기 위한 필수 규칙입니다.
새로운 코드를 작성하거나 리팩토링할 때 반드시 참고하세요.

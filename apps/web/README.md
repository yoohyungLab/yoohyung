# Pickid Web App 사용자 애플리케이션

**심리 테스트를 경험하는 사용자들을 위한 웹 애플리케이션입니다.**

<br/>

## 💻 기술 스택

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?logo=react&logoColor=white)![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

<br/><br/>

# 🏗️ 아키텍처

## FSD (Feature-Sliced Design) + MVVM

**구조**: 기능별 모듈화, 도메인 중심 설계

### 아키텍처 패턴

- **features/\*/ui**: View(프레젠테이션)
- **features/\*/hooks**: ViewModel(로직/상태)
- **shared/api/services**: Data access(Supabase 호출)
- **shared/lib|hooks|types**: 공용 유틸/타입

### 주요 특징

- 기능별 모듈화로 확장성과 유지보수성 향상
- MVVM 패턴으로 View와 로직 분리
- 도메인 중심 설계로 비즈니스 로직 명확화

## 📊 아키텍처 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  app/ (Server Components + RSC)                      │   │
│  │  - page.tsx / layout.tsx                            │   │
│  │  - 동적 라우트 (tests/[id], feedback/[id] 등)        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    FSD Layers                               │
│                                                             │
│  widgets/     → 헤더·푸터·드로어 같은 복합 UI               │
│  features/*/ui → View (프레젠테이션)                         │
│  features/*/model/hooks → ViewModel (TanStack Query, 상태)  │
│  shared/api/services → Data Access (Supabase 호출)          │
│  shared/lib|types|constants → 공통 유틸/타입/상수           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│  - Supabase (Database + Auth + Storage)                     │
│  - Google Analytics 4                                       │
└─────────────────────────────────────────────────────────────┘
```

<br/><br/>

# 📁 디렉토리 구조 및 URL

### URL 구조

| 기능            | URL                  |
| :-------------- | :------------------- |
| **홈**          | `/`                  |
| **테스트 상세** | `/tests/[id]`        |
| **테스트 결과** | `/tests/[id]/result` |
| **카테고리**    | `/category`          |
| **인기 테스트** | `/popular`           |
| **마이페이지**  | `/mypage`            |
| **피드백**      | `/feedback`          |
| **피드백 작성** | `/feedback/create`   |
| **로그인**      | `/auth/login`        |
| **회원가입**    | `/auth/register`     |

<br/><br/>

# 주요 디렉토리

```
src/
├── app/                          # (Next.js App Router) 페이지 라우팅
│   ├── api/                      # API 라우트
│   ├── auth/                     # 인증 페이지
│   │   ├── callback/             # OAuth 콜백
│   │   ├── login/                # 로그인
│   │   └── register/             # 회원가입
│   ├── category/                 # 카테고리 페이지
│   ├── feedback/                 # 피드백 페이지
│   │   ├── [id]/                 # 피드백 상세
│   │   └── create/                # 피드백 작성
│   ├── mypage/                   # 마이페이지
│   ├── popular/                  # 인기 테스트
│   ├── tests/                    # 테스트 페이지
│   │   └── [id]/                 # 동적 라우트
│   │       ├── page.tsx           # 테스트 상세
│   │       └── result/            # 테스트 결과
│   ├── layout.tsx                # 루트 레이아웃
│   ├── page.tsx                   # 홈 페이지
│   ├── error.tsx                  # 에러 페이지
│   ├── not-found.tsx              # 404 페이지
│   ├── robots.ts                  # robots.txt
│   └── sitemap.ts                 # sitemap.xml
│
├── features/                      # (FSD) 기능별 모듈
│   ├── auth/                      # 인증 기능
│   │   ├── config/                # 설정 (스키마)
│   │   ├── model/                 # ViewModel (로직/상태)
│   │   │   └── useAuth.ts
│   │   └── ui/                    # View (프레젠테이션)
│   │       ├── auth-form.tsx
│   │       └── auth-layout.tsx
│   │
│   ├── test/                      # 테스트 기능
│   │   ├── config/                # 테스트 설정
│   │   │   ├── quiz-constants.ts
│   │   │   └── themes.ts
│   │   ├── lib/                   # 테스트 유틸리티
│   │   │   ├── quiz-utils.ts
│   │   │   └── session-storage.ts
│   │   ├── model/                 # ViewModel
│   │   │   ├── hooks/             # 비즈니스 로직 훅
│   │   │   │   ├── useBalanceGameQuestion.ts
│   │   │   │   ├── useBalanceGameResult.ts
│   │   │   │   ├── usePopularTests.ts
│   │   │   │   ├── useProgress.ts
│   │   │   │   ├── useQuizResult.ts
│   │   │   │   ├── useQuizTaking.ts
│   │   │   │   ├── useTestBalanceGame.ts
│   │   │   │   ├── useTestList.ts
│   │   │   │   ├── useTestResult.ts
│   │   │   │   └── useTestResultShare.ts
│   │   │   └── types/             # 테스트 타입
│   │   │       ├── balance-game.ts
│   │   │       ├── balance.ts
│   │   │       ├── psychology.ts
│   │   │       ├── quiz.ts
│   │   │       └── test.ts
│   │   └── ui/                    # View
│   │       ├── balance-game/      # 밸런스 게임 UI
│   │       │   ├── balance-game-question.tsx
│   │       │   ├── balance-game-result-container.tsx
│   │       │   ├── balance-game-result-content.tsx
│   │       │   ├── balance-game-result-header.tsx
│   │       │   └── sections/
│   │       ├── psychology/        # 심리 테스트 UI
│   │       │   ├── psychology-question-container.tsx
│   │       │   ├── test-result-container.tsx
│   │       │   ├── test-result-content.tsx
│   │       │   ├── test-result-header.tsx
│   │       │   ├── gender-select-modal.tsx
│   │       │   ├── shared-result-landing.tsx
│   │       │   └── sections/      # 결과 섹션들
│   │       │       ├── compatibility-section.tsx
│   │       │       ├── description-section.tsx
│   │       │       ├── gifts-section.tsx
│   │       │       └── jobs-section.tsx
│   │       ├── quiz/              # 퀴즈 UI
│   │       │   ├── quiz-question-container.tsx
│   │       │   ├── quiz-result-container.tsx
│   │       │   ├── quiz-result-content.tsx
│   │       │   ├── quiz-result-header.tsx
│   │       │   └── sections/
│   │       ├── shared/            # 공통 UI
│   │       │   ├── popular-tests-section.tsx
│   │       │   ├── question-layout.tsx
│   │       │   ├── test-cta-buttons.tsx
│   │       │   └── test-intro.tsx
│   │       ├── test-page-client.tsx
│   │       └── test-result-page-client.tsx
│   │
│   ├── home/                      # 홈 기능
│   │   ├── model/                 # ViewModel
│   │   │   ├── hooks/
│   │   │   │   └── useHomeBalanceGame.ts
│   │   │   └── types.ts
│   │   └── ui/                    # View
│   │       ├── home-container.tsx
│   │       ├── banner-carousel.tsx
│   │       ├── category-filter.tsx
│   │       ├── test-section.tsx
│   │       ├── balance-game-section.tsx
│   │       ├── ad-banner-inline.tsx
│   │       └── ad-banner-sticky.tsx
│   │
│   ├── category/                  # 카테고리 기능
│   │   └── ui/
│   │       ├── category-container.tsx
│   │       ├── category-card.tsx
│   │       ├── category-navigation.tsx
│   │       └── test-filter.tsx
│   │
│   ├── feedback/                  # 피드백 기능
│   │   ├── lib/
│   │   │   └── utils.ts
│   │   ├── model/
│   │   │   └── hooks/
│   │   │       └── useFeedback.ts
│   │   └── ui/
│   │       ├── feedback-list.tsx
│   │       ├── feedback-form.tsx
│   │       └── feedback-category-selector.tsx
│   │
│   └── mypage/                    # 마이페이지 기능
│       └── ui/
│           └── mypage-container.tsx
│
├── shared/                        # (공유 모듈) API 서비스 및 공통 로직
│   ├── api/                       # API 서비스 (Data Access)
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── category.service.ts
│   │       ├── feedback.service.ts
│   │       ├── home.service.ts
│   │       ├── home-balance-game.service.ts
│   │       ├── popular.service.ts
│   │       ├── test.service.ts
│   │       ├── test-result.service.ts
│   │       ├── test-response.service.ts
│   │       └── optimized-balance-game-stats.service.ts
│   │
│   ├── config/                    # 설정
│   │   └── metadata.ts
│   │
│   ├── constants/                 # 상수
│   │   ├── routes.ts              # 라우트 상수
│   │   ├── test.ts                # 테스트 상수
│   │   ├── feedback.ts
│   │   ├── quiz.ts
│   │   ├── ui.ts
│   │   └── common.ts
│   │
│   ├── lib/                       # 유틸리티 함수
│   │   ├── analytics.ts           # GA4 이벤트 트래킹
│   │   ├── balance-game.ts
│   │   ├── color-utils.ts
│   │   ├── format-utils.ts
│   │   ├── metadata.ts
│   │   ├── supabase-error-handler.ts
│   │   ├── test-utils.ts
│   │   ├── type-guards.ts
│   │   └── utils.ts
│   │
│   ├── providers/                  # React Context Provider
│   │   └── session.provider.tsx
│   │
│   ├── types/                      # 공통 타입
│   │   ├── auth.ts
│   │   ├── home.ts
│   │   └── test.ts
│   │
│   └── ui/                        # 공통 UI 컴포넌트
│       ├── cards/                 # 카드 컴포넌트
│       │   ├── base-card.tsx
│       │   ├── carousel-card.tsx
│       │   └── home-card.tsx
│       ├── icons/
│       │   └── section-icons.tsx
│       ├── seo/
│       │   └── test-result-structured-data.tsx
│       ├── google-analytics.tsx
│       └── loading.tsx
│
└── widgets/                       # (FSD) 복잡한 UI 조합
    ├── header.tsx                 # 헤더
    ├── footer.tsx                 # 푸터
    ├── sidebar-drawer.tsx         # 사이드바 드로어
    ├── menu-content.tsx           # 메뉴 콘텐츠
    └── auth-section.tsx           # 인증 섹션
```

## 🔄 데이터 흐름도

### SSR (Server-Side Rendering) 흐름

```
Browser
  │
  ▼
app/page.tsx (Server Component)
  │  const data = await homeService.getHomePageData();
  │  return <HomeContainer {...data} />;
  ▼
shared/api/services/home.service.ts
  │  const supabase = createServerClient();
  │  const data = await supabase
  │    .from('tests')
  │    .select('id,title,thumbnail_url');
  ▼
Supabase Database
```

### CSR (Client-Side Rendering) 흐름

```
Browser
  │
  ▼
features/test/ui/test-page-client.tsx
  │  const { data } = useTestResult({ testId });
  │  return <TestResultContainer data={data} />;
  ▼
features/test/model/hooks/useTestResult.ts
  │  const { data } = useQuery({
  │    queryKey: queryKeys.test.result(testId),
  │    queryFn: () => testResultService.getResult(testId),
  │  });
  ▼
shared/api/services/test-result.service.ts
  │  const response = await supabase
  │    .from('test_results')
  │    .select('*')
  │    .eq('test_id', testId)
  ▼
Supabase Database
```

---

<br/>

## 📦 사용하는 공통 패키지

- `@pickid/ui`: 공통 UI 컴포넌트
- `@pickid/shared`: 공통 유틸리티
- `@pickid/supabase`: 데이터 접근 레이어
- `@pickid/types`: 공통 타입 정의
- `@pickid/config`: 공통 설정

## 🎯 레이어별 역할

| 레이어                    | 역할                                     | 예시                                                     |
| ------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| `app/`                    | 라우팅, SSR 데이터 페칭, 메타데이터 구성 | `app/page.tsx`, `app/tests/[id]/page.tsx`                |
| `widgets/`                | 전역/복합 UI 조합                        | `widgets/header.tsx`, `widgets/sidebar-drawer.tsx`       |
| `features/*/ui/`          | 도메인 View 컴포넌트                     | `features/test/ui/test-page-client.tsx`                  |
| `features/*/model/hooks/` | ViewModel, 서버 상태/비즈니스 로직       | `features/test/model/hooks/useTestResult.ts`             |
| `features/*/model/types/` | 도메인 타입 정의                         | `features/test/model/types/test.ts`                      |
| `shared/api/services/`    | Supabase 데이터 접근 계층                | `shared/api/services/test.service.ts`                    |
| `shared/lib/`             | 공용 유틸(analytics, format 등)          | `shared/lib/analytics.ts`, `shared/lib/utils.ts`         |
| `shared/types/`           | 공용 타입                                | `shared/types/auth.ts`, `shared/types/test.ts`           |
| `shared/constants/`       | 공용 상수                                | `shared/constants/routes.ts`, `shared/constants/test.ts` |

## 🧩 기능 모듈 구조 예시 (test feature)

```
features/test/
│
├── ui/                          # View Layer
│   ├── test-page-client.tsx
│   ├── test-result-page-client.tsx
│   ├── psychology/
│   │   ├── psychology-question-container.tsx
│   │   ├── test-result-container.tsx
│   │   ├── test-result-header.tsx
│   │   └── sections/ (compatibility, description 등)
│   ├── balance-game/
│   │   ├── balance-game-question.tsx
│   │   └── balance-game-result-container.tsx
│   ├── quiz/
│   │   ├── quiz-question-container.tsx
│   │   └── quiz-result-container.tsx
│   └── shared/
│       ├── test-cta-buttons.tsx
│       └── question-layout.tsx
│
├── model/                       # ViewModel Layer
│   ├── hooks/
│   │   ├── useTestResult.ts
│   │   ├── useTestBalanceGame.ts
│   │   ├── useProgress.ts
│   │   ├── useQuizTaking.ts
│   │   └── useTestResultShare.ts
│   └── types/
│       ├── test.ts
│       ├── psychology.ts
│       ├── balance-game.ts
│       └── quiz.ts
│
├── lib/                         # 기능별 유틸리티
│   ├── session-storage.ts
│   └── quiz-utils.ts
│
└── config/
    ├── quiz-constants.ts
    └── themes.ts
```

### 데이터 흐름 (test feature 예시)

```
app/tests/[id]/page.tsx
    └─→ features/test/ui/test-page-client.tsx
          └─→ features/test/model/hooks/useTestBalanceGame.ts
                └─→ shared/api/services/test.service.ts
                      └─→ Supabase

app/tests/[id]/result/page.tsx
    └─→ features/test/ui/test-result-page-client.tsx
          ├─→ features/test/model/hooks/useTestResult.ts
          │     └─→ shared/api/services/test-result.service.ts
          └─→ features/test/model/hooks/useTestResultShare.ts
                └─→ shared/lib/analytics.ts (GA4 이벤트)
```

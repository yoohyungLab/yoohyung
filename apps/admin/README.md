# Pickid Admin App 관리자

**테스트를 생성하고 관리하는 사용자들을 위한 관리자 대시보드입니다.**

<br/>

## 💻 기술 스택

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white) ![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white) ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

<br/>

# 🏗️ 아키텍처

## 레이어드 아키텍처 (Layered Architecture)

**구조**: Presentation → Business Logic → Data Access → Infrastructure

### 계층별 책임

- **Presentation Layer** (`pages/`, `components/`): UI 컴포넌트 및 페이지
- **Business Logic Layer** (`hooks/`): 비즈니스 로직, React Query hooks, 상태 관리
- **Data Access Layer** (`services/`): Supabase API 호출 및 데이터 접근
- **Infrastructure Layer** (`lib/`, `types/`, `utils/`): 유틸리티 및 타입 정의

### 주요 특징

- 계층별 명확한 책임 분리
- 단순한 관리자 도구에 최적화
- 의존성 방향: 상위 계층 → 하위 계층

<br/>

### URL 구조

| 기능                 | URL                                 |
| :------------------- | :---------------------------------- |
| **대시보드**         | `/`                                 |
| **테스트 관리**      | `/tests`                            |
| **테스트 생성/수정** | `/tests/create` / `/tests/:id/edit` |
| **카테고리 관리**    | `/categories`                       |
| **사용자 관리**      | `/users`                            |
| **성과 분석**        | `/analytics`                        |
| **성장 분석**        | `/growth`                           |
| **인증**             | `/auth`                             |

### 주요 디렉토리

```
src/
├── pages/           # (Presentation) URL 경로 매핑된 페이지
├── components/      # (Presentation) 재사용 가능한 UI 컴포넌트
├── hooks/           # (Business Logic) React Query hooks, 비즈니스 로직
│   ├── query-keys.ts      # QueryKey 중앙 관리
│   ├── useTests.ts        # 테스트 목록 + mutations
│   ├── useTestList.ts     # 테스트 목록 조회
│   └── ...
├── services/        # (Data Access) Supabase API 호출
│   ├── test.service.ts
│   └── ...
├── types/           # (Infrastructure) 타입 정의
├── utils/           # (Infrastructure) 유틸리티 함수
└── lib/             # (Infrastructure) 공통 로직
```

### QueryKey 관리

모든 React Query의 queryKey는 `hooks/query-keys.ts`에서 중앙 관리합니다.

```ts
// hooks/query-keys.ts
export const queryKeys = {
  test: {
    all: ['test'] as const,
    list: () => [...queryKeys.test.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.test.all, 'detail', id] as const,
  },
  // ...
};
```

---

<br/>

## 📦 사용하는 공통 패키지

- `@pickid/ui`: 공통 UI 컴포넌트
- `@pickid/shared`: 공통 유틸리티
- `@pickid/supabase`: 데이터 접근 레이어
- `@pickid/types`: 공통 타입 정의
- `@pickid/config`: 공통 설정

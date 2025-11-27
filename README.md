# [[Pickid] 나를 알아가는 심리테스트 플랫폼](https://pickid-fo.vercel.app)

<br/>

## 프로젝트 소개

> **픽키드**는 간단한 설문을 통해 사용자의 **성향 및 성격 타입**을 도출하는 심리 테스트 플랫폼입니다.

<br/>

## 서비스 플로우

> 홈 &nbsp; ➡️ &nbsp; 성별 선택 &nbsp; ➡️ &nbsp; 질문지&nbsp; ➡️&nbsp; 결과 페이지&nbsp; ➡️&nbsp; 공유 or 다시하기

<br/>

## 기술 스택

**Web**  
![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?logo=react&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

**Admin**  
![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

**공용 인프라**  
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-000000?logo=turborepo&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

<br/>

## 아키텍처

### 1️⃣ Monorepo 구조

```
pickid-monorepo/
├── apps/
│   ├── web/              # Next.js 웹 앱
│   └── admin/            # React + Vite 어드민 앱
└── packages/
    ├── ui/               # 공통 UI (shadcn/ui 기반)
    ├── supabase/         # Supabase 클라이언트
    ├── shared/           # 공용 유틸/훅
    ├── types/            # 공용 타입
    └── config/           # 공통 설정
```

### 2️⃣ Web 앱: Next.js App Router

```
apps/web/src/
├── app/                      # Next.js App Router (SSR/CSR)
│   ├── [도메인]/
│   │   ├── components/       # 도메인별 UI
│   │   ├── hooks/           # 도메인별 비즈니스 로직
│   │   └── page.tsx         # 서버 컴포넌트 (SSR)
│   ├── layout.tsx
│   └── page.tsx
│
├── api/services/             # Data Access Layer (Supabase)
├── components/               # 공용 UI
├── lib/                      # 공용 유틸리티
├── constants/                # 공용 상수
└── types/                    # 공용 타입
```

### 3️⃣ Admin 앱: React Router 기반 SPA

```
apps/admin/src/
├── config/routes.tsx         # React Router 라우트 설정
├── pages/                    # Presentation Layer
├── components/               # 재사용 UI
├── hooks/                    # Business Logic Layer
├── services/                 # Data Access Layer (Supabase)
├── lib/                      # Infrastructure Layer
├── constants/                # 공용 상수
└── types/                    # 타입 정의
```

### 5️⃣ Supabase 기반 백엔드 설계

- **RLS(Row Level Security)**: 모든 테이블에 RLS 정책 적용
- **데이터베이스 함수**: `get_dashboard_stats`, `get_top_tests_today` 등 통계 함수
- **자동 카운터**: 조회/참여 카운터 자동 증가 구현

<br/>

## 주요 기능

- Web

  - 인증/권한 관리, 심리테스트/밸런스게임/퀴즈 3가지 타입 지원, 공유 기능

- Admin

  - 테스트 생성/수정/관리, 사용자/응답/카테고리/건의사항 관리

- 성능 최적화

  - SSR/CSR 전략 적용, Next.js Image 최적화, 코드 스플리팅, TanStack Query 캐싱 전략

- seo
  - 동적 메타데이터, 사이트맵 자동 생성, GA4 연동

<br/>

## 문서

- [픽키드 서비스 기획서 (Notion)](https://www.notion.so/ming96/Pickid-e7eb0c8f9e27425ba729008c84b40e1c?source=copy_link)

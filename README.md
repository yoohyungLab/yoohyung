# [Pickid] 나를 알아가는 심리테스트 플랫폼

### 👋 배포 주소

### [픽키드](https://pickid-fo.vercel.app)

<br/><br/>

# 🔥 프로젝트 소개

> **픽키드**는 간단한 설문을 통해 사용자의 **성향 및 성격 타입**을 도출하는 심리 테스트 플랫폼입니다.

<br/><br/>

# 🌊 서비스 플로우

> 홈 ➡️ 성별 선택 ➡️ 질문지 ➡️ 결과 페이지 ➡️ 공유 or 다시하기

1. **홈 화면**: 다양한 테스트 탐색 및 카테고리별 필터링
2. **성별 선택**: 성별별 맞춤 결과 제공
3. **질문지**: 한 번에 1문항씩, 진행률 표시와 부드러운 애니메이션
4. **결과 페이지**: 성향 분석, 추천 직업, 관계 유형까지 제공
5. **공유**: 친구와 결과 비교하며 재미있게 소통

<br/><br/>

# 💻 기술 스택

### Web

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-764ABC?logo=react&logoColor=white)

### Admin

![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?logo=zod&logoColor=white)

### 공용 인프라 · 패키지

![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-000000?logo=turborepo&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

<br/><br/>

# 🏗️ 아키텍처

### Web 앱: **FSD (Feature-Sliced Design) + MVVM**

- **구조**: 기능별 모듈화, 도메인 중심 설계
- **상세**: [apps/web/README.md](./apps/web/README.md) 참고

### Admin 앱: **레이어드 아키텍처**

- **구조**: Presentation → Business Logic → Data Access → Infrastructure
- **특징**: 계층별 명확한 책임 분리, 단순한 관리자 도구에 최적화
- **상세**: [apps/admin/README.md](./apps/admin/README.md) 참고

<br/><br/>

# 📁 프로젝트 구조

### apps/

**apps/web**: 사용자용 웹 애플리케이션입니다. Next.js 14 (App Router)를 사용하여 SSR/CSR을 지원하며, FSD + MVVM 아키텍처를 따릅니다.

**apps/admin**: 관리자가 테스트를 생성하고 관리하는 어드민 대시보드입니다. React + Vite로 구성되어 있으며, 레이어드 아키텍처를 따릅니다.

### packages/

**packages/ui**: 공통적으로 사용될 디자인 컴포넌트가 포함된 패키지입니다. shadcn/ui 기반의 재사용 가능한 UI 컴포넌트를 제공합니다.

**packages/shared**: 공통 유틸리티 함수와 훅이 포함된 패키지입니다.

**packages/supabase**: 데이터 접근 레이어 패키지입니다. Supabase 클라이언트 생성 및 타입 정의를 포함합니다.

**packages/types**: 공통 타입 정의가 포함된 패키지입니다.

**packages/config**: 공통 설정(ESLint, TypeScript 등)이 포함된 패키지입니다.

### supabase/

**supabase/**: 데이터베이스 마이그레이션 및 설정 파일이 포함된 디렉토리입니다.

<br/><br/>

# 📚 문서

- [픽키드 서비스 기획서 (Notion)](https://www.notion.so/ming96/Pickid-e7eb0c8f9e27425ba729008c84b40e1c?source=copy_link) - 서비스 기획, 칸반 보드, 메모 등

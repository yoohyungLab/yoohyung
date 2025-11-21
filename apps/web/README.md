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
├── app/              # (Next.js App Router) 페이지 라우팅
├── features/         # (FSD) 기능별 모듈
│   ├── auth/        # 인증 기능
│   ├── test/        # 테스트 기능
│   ├── home/        # 홈 기능
│   ├── category/    # 카테고리 기능
│   ├── feedback/    # 피드백 기능
│   └── mypage/      # 마이페이지 기능
├── shared/           # (공유 모듈) API 서비스 및 공통 로직
│   ├── api/         # API 서비스
│   ├── hooks/       # 공통 훅
│   ├── lib/          # 유틸리티 함수
│   └── types/        # 공통 타입
└── widgets/          # (FSD) 복잡한 UI 조합
    ├── header/
    ├── footer/
    └── ...
```

---

<br/>

## 📦 사용하는 공통 패키지

- `@pickid/ui`: 공통 UI 컴포넌트
- `@pickid/shared`: 공통 유틸리티
- `@pickid/supabase`: 데이터 접근 레이어
- `@pickid/types`: 공통 타입 정의
- `@pickid/config`: 공통 설정

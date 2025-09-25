# Admin 앱

관리자 대시보드 애플리케이션입니다. **레이어드 아키텍처(Layered Architecture)** 구조를 따릅니다.

---

## 📁 디렉토리 구조

```
apps/admin/src/
├── pages/                     # Presentation Layer - 페이지 컴포넌트
│   ├── auth/                  # 인증 페이지
│   ├── categories/            # 카테고리 관리 페이지
│   ├── feedback/              # 피드백 관리 페이지
│   ├── tests/                 # 테스트 관리 페이지
│   └── users/                 # 사용자 관리 페이지
├── components/                # Presentation Layer - 재사용 가능한 UI 컴포넌트
│   ├── category/              # 카테고리 관련 컴포넌트
│   ├── feedback/              # 피드백 관련 컴포넌트
│   ├── layout/                # 레이아웃 컴포넌트
│   ├── test/                  # 테스트 관련 컴포넌트
│   ├── ui/                    # 기본 UI 컴포넌트
│   └── user/                  # 사용자 관련 컴포넌트
├── widgets/                   # Presentation Layer - 복잡한 UI 조합
│   ├── header/                # 헤더 위젯
│   ├── layout/                # 레이아웃 위젯
│   └── sidebar/               # 사이드바 위젯
├── hooks/                     # Business Logic Layer - 상태 관리 & 비즈니스 로직
│   ├── useAdminAuth.ts        # 관리자 인증
│   ├── useCategories.ts       # 카테고리 관리
│   ├── useFeedbacks.ts        # 피드백 관리
│   ├── useTests.ts            # 테스트 관리
│   ├── useTestSteps.ts        # 테스트 단계 관리
│   └── useUsers.ts            # 사용자 관리
├── shared/                    # 공유 로직
│   ├── api/                   # Data Access Layer - API 서비스
│   │   ├── services/          # 비즈니스 로직 (Service Layer)
│   │   ├── types/             # API 타입 정의
│   │   └── index.ts           # API exports
│   ├── hooks/                 # 공통 훅
│   ├── lib/                   # Infrastructure Layer - 유틸리티 함수
│   └── types/                 # 공통 타입
├── types/                     # Domain Layer - 앱 전용 타입
├── utils/                     # Infrastructure Layer - 앱 전용 유틸리티
└── contexts/                  # Business Logic Layer - 전역 상태 관리
```

---

## 🏗️ 레이어별 역할

### 1. Presentation Layer (표현 계층)

- **위치**: `pages/`, `components/`, `widgets/`
- **역할**: UI 렌더링 및 사용자 상호작용
- **제약**: 비즈니스 로직 없음, 순수 프레젠테이션
- **예시**: `FeedbackListPage`, `UserDetailModal`

### 2. Business Logic Layer (비즈니스 로직 계층)

- **위치**: `hooks/`, `contexts/`
- **역할**: 상태 관리, 비즈니스 규칙, 오케스트레이션
- **기능**: React Query, 상태 관리, 폼 처리
- **예시**: `useFeedbacks`, `useUsers`

### 3. Data Access Layer (데이터 접근 계층)

- **위치**: `shared/api/services/`
- **역할**: 외부 API 호출, 데이터 변환
- **기능**: API 서비스, 데이터 매핑
- **예시**: `feedbackService`, `userService`

### 4. Infrastructure Layer (인프라 계층)

- **위치**: `shared/lib/`, `utils/`
- **역할**: 유틸리티 함수, 외부 라이브러리 래핑
- **기능**: 헬퍼 함수, 상수, 설정
- **예시**: `formatUtils`, `constants`

### 5. Domain Layer (도메인 계층)

- **위치**: `types/`, `shared/types/`
- **역할**: 도메인 모델, 타입 정의
- **기능**: 엔티티, 값 객체, 타입 정의
- **예시**: `User`, `Feedback`, `Test`

### 의존성 규칙

```
Presentation → Business Logic → Data Access → Infrastructure
     ↓              ↓              ↓
  Domain Layer (모든 레이어에서 참조 가능)
```

- **Presentation**: Business Logic만 호출 가능
- **Business Logic**: Data Access만 호출 가능
- **Data Access**: Infrastructure만 호출 가능
- **Domain**: 모든 레이어에서 참조 가능

---

## 🛠️ 기술 스택

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn
- **API**: Supabase Client

---

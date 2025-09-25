# Web 앱

사용자 대시보드 애플리케이션입니다. **Feature-Sliced Design(FSD) + MVVM Lite** 구조를 따릅니다.

---

## 📁 디렉토리 구조

```
apps/web/src/
├── app/                        # 앱 엔트리포인트, 전역 설정
│   ├── auth/                   # 인증 관련 페이지
│   ├── feedback/               # 피드백 관련 페이지
│   ├── home/                   # 홈 페이지
│   ├── mypage/                 # 마이페이지
│   ├── tests/                  # 테스트 관련 페이지
│   ├── t/                      # 테스트 실행 페이지
│   ├── favorites/              # 즐겨찾기 페이지
│   ├── globals.css             # 전역 스타일
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 홈페이지
├── processes/                  # 장기 실행 프로세스
│   └── auth/                   # 인증 세션 관리
├── pages/                      # 라우트 단위 화면 (FSD pages 레이어)
│   └── home/                   # 홈 페이지 로직
├── widgets/                    # UI 위젯 단위
│   ├── favorites-list/         # 즐겨찾기 목록 위젯
│   ├── footer/                 # 푸터 위젯
│   ├── header/                 # 헤더 위젯
│   ├── hero-banner/            # 히어로 배너 위젯
│   ├── layout/                 # 레이아웃 위젯
│   ├── loading-spinner/        # 로딩 스피너 위젯
│   ├── result-display/         # 결과 표시 위젯
│   └── sidebar.tsx             # 사이드바 위젯
├── features/                   # 핵심 기능 단위
│   ├── auth/                   # 인증 기능
│   │   ├── ui/                 # View (React 컴포넌트)
│   │   ├── model/              # ViewModel (hooks, state, 비즈니스 규칙)
│   │   └── api/                # Model (API, 데이터 접근)
│   ├── authentication/         # 인증 처리
│   ├── feedback/               # 피드백 기능
│   ├── home/                   # 홈 기능
│   ├── test-results/           # 테스트 결과 기능
│   └── test-taking/            # 테스트 진행 기능
├── entities/                   # 비즈니스 엔티티
│   ├── result/                 # 결과 엔티티
│   ├── test/                   # 테스트 엔티티
│   ├── test-result/            # 테스트 결과 엔티티
│   └── user/                   # 사용자 엔티티
├── shared/                     # 공통 모듈
│   ├── config/                 # 설정
│   ├── constants/              # 상수
│   ├── hooks/                  # 공통 훅
│   ├── lib/                    # 유틸리티 함수
│   ├── types/                  # 공통 타입
│   └── ui/                     # 공통 UI 컴포넌트
└── api/                        # API 레이어
    ├── auth.api.ts             # 인증 API
    ├── test.api.ts             # 테스트 API
    └── index.ts                # API exports
```

---

## 🏗️ FSD + MVVM Lite 구조

### 1. Feature-Sliced Design (폴더 구조)

- **app/**: 앱 엔트리포인트, 전역 설정
- **processes/**: 장기 실행 프로세스 (ex: auth session)
- **pages/**: 라우트 단위 화면
- **widgets/**: UI 위젯 단위
- **features/**: 핵심 기능 단위
- **entities/**: 비즈니스 엔티티
- **shared/**: 공통 모듈

### 2. MVVM Lite (코드 레벨 역할 분리)

#### View (표현 계층)

- **위치**: `features/*/ui/`, `widgets/`, `pages/`
- **역할**: UI 렌더링 및 사용자 상호작용
- **특징**: 상태 로직이나 데이터 접근을 포함하지 않음
- **예시**: `features/auth/ui/LoginForm.tsx`

#### ViewModel (비즈니스 로직 계층)

- **위치**: `features/*/model/`
- **역할**: 상태 관리 & 비즈니스 규칙
- **특징**: useCase 또는 service 로직을 조합해 View에 필요한 데이터 제공
- **예시**: `features/auth/model/useLoginViewModel.ts`

#### Model (데이터 접근 계층)

- **위치**: `features/*/api/`, `api/`
- **역할**: 데이터 정의 및 단순 가공
- **특징**: Supabase API 호출, DTO 변환, 공통 타입
- **예시**: `features/auth/api/login.ts`

### 의존성 규칙

```
View → ViewModel → Model
  ↓        ↓        ↓
Shared (모든 레이어에서 참조 가능)
```

- **View**: ViewModel만 호출 가능
- **ViewModel**: Model만 호출 가능
- **Model**: Shared만 호출 가능
- **Shared**: 모든 레이어에서 참조 가능

---

## 🧩 MVVM Lite 적용 방식

### View (React 컴포넌트)

```typescript
// features/auth/ui/LoginForm.tsx
export function LoginForm() {
	const { form, handleSubmit, isLoading } = useLoginViewModel();

	return <form onSubmit={handleSubmit}>{/* UI 렌더링만 담당 */}</form>;
}
```

### ViewModel (비즈니스 로직)

```typescript
// features/auth/model/useLoginViewModel.ts
export function useLoginViewModel() {
	const { login } = useAuthApi();

	// 상태 관리 & 비즈니스 규칙
	const form = useForm();
	const handleSubmit = async (data) => {
		await login(data);
	};

	return { form, handleSubmit, isLoading };
}
```

### Model (데이터 접근)

```typescript
// features/auth/api/login.ts
export function useAuthApi() {
	const login = async (credentials) => {
		// Supabase API 호출
		return await supabase.auth.signInWithPassword(credentials);
	};

	return { login };
}
```

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Supabase Client
- **State Management**: React Query + Zustand

---

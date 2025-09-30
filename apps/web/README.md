# Web 앱

사용자 대시보드 애플리케이션입니다. **Layered Architecture + FSD** 구조를 따릅니다.

---

## 📁 디렉토리 구조

```
apps/web/src/
├── app/                        # Next.js 앱 엔트리포인트, 전역 설정
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
├── pages/                      # 라우트 단위 화면
│   └── home/                   # 홈 페이지 로직
├── widgets/                    # UI 위젯 단위 (FSD)
│   ├── favorites-list/         # 즐겨찾기 목록 위젯
│   ├── footer/                 # 푸터 위젯
│   ├── header/                 # 헤더 위젯
│   ├── hero-banner/            # 히어로 배너 위젯
│   ├── layout/                 # 레이아웃 위젯
│   ├── loading-spinner/        # 로딩 스피너 위젯
│   ├── result-display/         # 결과 표시 위젯
│   └── sidebar/                # 사이드바 위젯
├── features/                   # 핵심 기능 단위 (FSD)
│   ├── auth/                   # 인증 기능
│   │   ├── ui/                 # View (React 컴포넌트)
│   │   ├── hooks/              # ViewModel (Custom Hooks)
│   │   └── api/                # Service (API 호출)
│   ├── feedback/               # 피드백 기능
│   ├── home/                   # 홈 기능
│   ├── test-results/           # 테스트 결과 기능
│   └── test-taking/            # 테스트 진행 기능
├── shared/                     # 공통 모듈 (FSD)
│   ├── api/                    # Service Layer (API 호출만)
│   │   ├── services/           # 각 도메인별 서비스
│   │   └── index.ts            # API exports
│   ├── config/                 # 설정
│   ├── constants/              # 상수
│   ├── hooks/                  # 공통 훅
│   ├── lib/                    # 유틸리티 함수
│   ├── types/                  # 공통 타입
│   └── ui/                     # 공통 UI 컴포넌트
└── entities/                   # 비즈니스 엔티티 (FSD)
    ├── result/                 # 결과 엔티티
    ├── test/                   # 테스트 엔티티
    ├── test-result/            # 테스트 결과 엔티티
    └── user/                   # 사용자 엔티티
```

---

## 🏗️ Layered Architecture + FSD 구조

### 1. Layered Architecture (코드 레벨 역할 분리)

#### Presentation Layer (표현 계층)

- **위치**: `features/*/ui/`, `widgets/`, `pages/`
- **역할**: UI 렌더링 및 사용자 상호작용
- **특징**: 상태 로직이나 데이터 접근을 포함하지 않음

#### Business Logic Layer (비즈니스 로직 계층)

- **위치**: `features/*/hooks/`
- **역할**: 상태 관리 & 비즈니스 규칙
- **특징**: Custom Hooks로 ViewModel 역할 수행

#### Data Access Layer (데이터 접근 계층)

- **위치**: `shared/api/services/`
- **역할**: API 호출 & 데이터 변환
- **특징**: 순수한 API 호출만 담당

#### Infrastructure Layer (인프라 계층)

- **위치**: `shared/lib/`, `shared/config/`
- **역할**: 유틸리티 & 외부 라이브러리
- **특징**: 공통 기능 및 설정

### 2. Feature-Sliced Design (폴더 구조)

- **widgets/**: UI 위젯 단위 (재사용 가능한 UI 블록)
- **features/**: 핵심 기능 단위 (도메인별 기능 모듈)
- **shared/**: 공통 모듈 (모든 레이어에서 참조 가능)
- **entities/**: 비즈니스 엔티티 (도메인 모델)

### 의존성 규칙

```
Presentation → Business Logic → Data Access → Infrastructure
     ↓              ↓              ↓              ↓
   Shared (모든 레이어에서 참조 가능)
```

- **Presentation**: Business Logic만 호출 가능
- **Business Logic**: Data Access만 호출 가능
- **Data Access**: Infrastructure만 호출 가능
- **Shared**: 모든 레이어에서 참조 가능

---

## 🧩 Layered Architecture 적용 방식

### View (React 컴포넌트)

```typescript
// features/auth/ui/LoginForm.tsx
export function LoginForm() {
	const { form, handleSubmit, isLoading } = useAuth();

	return <form onSubmit={handleSubmit}>{/* UI 렌더링만 담당 */}</form>;
}
```

### ViewModel (Custom Hooks)

```typescript
// features/auth/hooks/useAuth.ts
export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const signIn = async (provider: string, credentials?: any) => {
		try {
			setLoading(true);
			const result = await authService.signIn(provider, credentials);

			// 비즈니스 로직: 삭제된 사용자 체크
			if (result.user?.user_metadata?.deleted_at) {
				await authService.signOut();
				throw new Error('탈퇴한 계정입니다.');
			}

			setUser(result.user);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	return { user, loading, signIn, signOut };
}
```

### Service (API 호출)

```typescript
// shared/api/services/auth.service.ts
export const authService = {
	async signIn(provider: string, credentials?: any) {
		if (provider === 'kakao') {
			return await supabase.auth.signInWithOAuth({
				provider: 'kakao',
				options: { redirectTo: `${window.location.origin}/auth/callback` },
			});
		}
		// 다른 로직들...
	},

	async signUp(email: string, password: string, name: string) {
		return await supabase.auth.signUp({
			email,
			password,
			options: { data: { name } },
		});
	},
};
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

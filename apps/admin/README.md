# Admin Dashboard

관리자 대시보드 애플리케이션입니다.

## 🏗️ 아키텍처

이 프로젝트는 **Feature-based + Shared** 아키텍처를 사용합니다.

### 📁 디렉토리 구조

```
src/
├── components/           # UI 컴포넌트
│   ├── ui/              # 공통 UI 컴포넌트 (AdminCard, BulkActions 등)
│   ├── user/            # 사용자 관련 컴포넌트 (ProfileDetailModal 등)
│   └── layout/          # 레이아웃 컴포넌트
├── pages/               # 페이지 컴포넌트 (라우팅용)
├── shared/              # 공통 유틸리티
│   ├── hooks/           # 공통 훅
│   ├── lib/             # 유틸리티 함수
│   └── api/             # API 서비스
├── widgets/             # 위젯 컴포넌트
└── types/               # 타입 정의
```

### 🎯 아키텍처 선택 이유

#### **Feature-based + Shared 구조를 선택한 이유:**

1. **생산성**: 혼자 개발하기에 적합한 단순한 구조
2. **학습비용**: 낮은 복잡도로 빠른 개발 가능
3. **유지보수**: 직관적이고 이해하기 쉬운 구조
4. **확장성**: 필요시 FSD로 마이그레이션 가능
5. **모노레포**: Web 앱과 다른 성격의 앱이므로 다른 구조 사용

#### **FSD vs Feature-based 비교:**

| 아키텍처          | 장점           | 단점                   | Admin 적합도    |
| ----------------- | -------------- | ---------------------- | --------------- |
| **FSD**           | 확장성, 일관성 | 복잡도, 보일러플레이트 | ⭐⭐ (과도함)   |
| **Feature-based** | 단순함, 생산성 | 중간 복잡도            | ⭐⭐⭐⭐ (적합) |

### 📦 컴포넌트 분류

#### **공통 컴포넌트 (`components/ui/`)**

-   여러 페이지에서 재사용되는 UI 컴포넌트
-   `AdminCard`, `BulkActions`, `DataState`, `FilterBar`, `StatsCards`

#### **기능별 컴포넌트 (`components/user/`)**

-   특정 기능에만 사용되는 컴포넌트
-   `ProfileDetailModal` (사용자 관리 전용)

### 🔄 Import 규칙

```typescript
// 공통 컴포넌트
import { AdminCard, BulkActions } from '../../components/ui';

// 기능별 컴포넌트
import { ProfileDetailModal } from '../../components/user';

// 공통 유틸리티
import { usePagination } from '@repo/shared';
import { profileService } from '@repo/supabase';

// UI 라이브러리
import { Button, DataTable } from '@repo/ui';
```

### 🚀 개발 가이드

#### **새로운 기능별 컴포넌트 추가시:**

1. `components/{feature-name}/` 디렉토리 생성
2. 컴포넌트 작성
3. `components/{feature-name}/index.ts`에서 export
4. 페이지에서 import하여 사용

#### **공통 컴포넌트 추가시:**

1. `components/ui/` 디렉토리에 추가
2. `components/ui/index.ts`에서 export
3. 필요한 곳에서 import하여 사용

### 📋 주요 기능

-   👥 **사용자 관리**: 사용자 목록, 상세보기, 상태 관리
-   💌 **피드백 관리**: 건의사항 조회, 답변, 상태 관리
-   🧪 **테스트 관리**: 테스트 목록, 생성, 수정
-   📊 **대시보드**: 통계 및 현황 조회
-   🏷️ **카테고리 관리**: 카테고리 CRUD

### 🛠️ 기술 스택

-   **Framework**: React 18 + TypeScript
-   **Build Tool**: Vite
-   **UI Library**: Radix UI + Tailwind CSS
-   **State Management**: React Hooks
-   **API**: Supabase
-   **Monorepo**: pnpm workspaces

### 📝 개발 노트

-   Admin 앱은 CRUD 중심의 단순한 구조가 대부분
-   과도한 구조화보다는 생산성을 우선시
-   필요시 나중에 FSD 아키텍처로 마이그레이션 가능
-   Web 앱과는 다른 성격이므로 다른 구조 사용해도 OK

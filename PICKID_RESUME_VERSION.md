# Pickid - 심리테스트 플랫폼

*(2024. ~ 진행중)*

`Next.js` `TypeScript` `Vite` `TanStack Query` `Zustand` `React Hook Form` `Zod` `Supabase` `FSD` `Layered Architecture` `Monorepo` `Turborepo` `shadcn/ui` `Tailwind CSS`

## Monorepo + 아키텍처 기반 설계

- `pnpm workspace + Turborepo` 기반 **Monorepo 구조 설계**
  - 공유 패키지(`@pickid/ui`, `@pickid/supabase`, `@pickid/shared`) 분리로 코드 재사용성 및 빌드 속도 최적화

- **Web 앱: FSD(Feature-Sliced Design) + MVVM 패턴**
  - `features / shared / widgets` 기반 도메인 중심 모듈화
  - View(ui) / ViewModel(hooks) / Data Access(services) 레이어 분리
  - 서버 컴포넌트(SSR)와 클라이언트 컴포넌트(CSR) 경계 명확화

- **Admin 앱: Layered Architecture**
  - Presentation → Business Logic → Data Access → Infrastructure 계층별 책임 분리

## Supabase 기반 백엔드 설계

- **RLS(Row Level Security) 전제 보안 구조**
  - 모든 테이블에 RLS 정책 적용, 컬럼 단위 접근 제어
  - 서버/클라이언트 Supabase 클라이언트 분리

- **데이터베이스 함수 기반 통계 시스템**
  - 대시보드 통계용 함수(`get_dashboard_stats`, `get_top_tests_today` 등) 설계
  - 테스트 조회/참여 카운터 자동 증가 함수 구현
  - 인덱스 최적화로 쿼리 성능 향상

## Web 앱 주요 기능 개발

### 테스트 타입별 구현

- **심리 테스트 (Psychology)**
  - 점수 기반 결과 매칭 알고리즘 구현
  - 성별 정보 수집 및 결과 필터링
  - 결과 페이지: 설명, 직업 추천, 선물 추천, 궁합 분석 등 섹션 구성

- **밸런스 게임 (Balance)**
  - 2지선다 선택 기반 투표 시스템
  - 주간별 다른 밸런스게임 자동 표시
  - 실시간 통계 및 재참여 기능
  - 로컬 스토리지 기반 투표 데이터 관리

- **퀴즈 (Quiz)**
  - 정답 기반 채점 시스템
  - 문제별 상세 결과 표시 (정답/오답, 해설)
  - 점수 계산 및 등급 산출

### 카테고리 및 필터링

- 카테고리별 테스트 목록 페이지
- 실시간 필터링 및 정렬 기능
- 인기 테스트 TOP 50 페이지 (SSR 기반)

### 사용자 기능

- Supabase Auth 기반 이메일/소셜 로그인
- 마이페이지 (참여 테스트, 즐겨찾기)
- 건의사항 작성 및 조회 시스템

## Admin 앱 주요 기능 개발

### 테스트 관리

- **테스트 생성/수정**
  - 단계별 폼 (기본정보 → 질문 → 결과 → 미리보기)
  - React Hook Form + Zod 기반 폼 검증
  - 이미지 업로드 및 썸네일 관리
  - 6가지 테스트 타입 지원 (psychology, balance, character, quiz, meme, lifestyle)

- **테스트 목록 및 관리**
  - 상태별 필터링 (draft, published, archived)
  - 테스트 통계 (조회수, 참여수) 실시간 표시

### 대시보드 및 분석

- **대시보드**
  - 핵심 KPI 카드 (활성 테스트, 오늘 응답, 방문자, 완료율)
  - 오늘의 인기 테스트 TOP 5

- **테스트 성과 분석**
  - 테스트별 상세 통계 (조회수, 참여수, 완료율)
  - 결과 분포 차트, 트렌드 분석 (일별/주별/월별)
  - 퍼널 분석 (시작 → 완료 → 공유), 공유 성과 분석

- **성장 분석**
  - 유입 채널 분석, 랜딩 페이지 분석, 코호트 분석

### 운영 관리

- 사용자 응답 관리 (응답 목록, 상세 정보, 통계)
- 카테고리 관리 (CRUD, 드래그 앤 드롭 정렬)
- 건의사항 관리 (목록, 상세, 관리자 답변)
- 유저 관리 (목록, 상세 정보)

## 성능 최적화 및 SEO

### 렌더링 최적화

- **SSR/CSR 전략 수립**
  - SEO/초기 페인트가 중요한 페이지는 SSR로 데이터 페칭
  - 상호작용이 많은 기능은 CSR로 처리

- **이미지 최적화**
  - Next.js Image 컴포넌트 활용, 주요 이미지 priority 설정

- **코드 스플리팅**
  - Dynamic import 활용, 페이지별 번들 최적화

### 데이터 페칭 최적화

- TanStack Query 캐싱 전략 (queryKey 일관화, staleTime: 5분)
- 불필요한 병렬 페칭 방지 (전역 위젯에서 자동 데이터 로드 금지)

### 성능 모니터링

- Lighthouse CI 도입 (빌드 시 자동 성능 측정, Web Vitals 모니터링)

### SEO 최적화

- 페이지별 동적 메타데이터 생성 (Open Graph, Twitter Card)
- next-sitemap 기반 자동 사이트맵 생성
- Google Analytics 연동 (GA4 이벤트 추적)

## 테스트 및 코드 품질

- Jest + React Testing Library (컴포넌트 단위 테스트, 커버리지 목표: 70%)
- TypeScript strict 모드 (타입 안전성 보장)
- ESLint + Prettier (일관된 코드 스타일 유지)
- Changesets 기반 버전 관리 (패키지별 독립적 버전 관리)


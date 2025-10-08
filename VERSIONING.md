# 버전 관리 가이드

## 개요

이 모노레포는 **Changesets**를 사용하여 체계적인 버전 관리를 수행합니다.

## 아키텍처

- **Monorepo**: Turborepo + pnpm workspaces
- **Package Manager**: pnpm 9.12.0
- **Versioning**: Changesets
- **CI/CD**: GitHub Actions

## 패키지 구조

```
packages/
├── @pickid/ui          # UI 컴포넌트 라이브러리
├── @pickid/shared      # 공유 유틸리티 및 훅
├── @pickid/supabase    # Supabase 클라이언트 및 타입
├── @pickid/types       # 공통 타입 정의
└── @pickid/icons       # 아이콘 컴포넌트

apps/
├── web                 # Next.js 웹 애플리케이션
└── admin              # Vite 관리자 애플리케이션
```

## 버전 관리 워크플로우

### 1. 변경사항 추가

```bash
# 새로운 변경사항을 추가
pnpm changeset

# 변경사항을 커밋
git add .
git commit -m "feat: 새로운 기능 추가"
```

### 2. 버전 업데이트

```bash
# 패키지 버전 업데이트
pnpm version-packages

# 변경사항 커밋
git add .
git commit -m "chore: 버전 업데이트"
```

### 3. 릴리스

```bash
# 패키지 빌드 및 발행
pnpm release
```

## Changesets 사용법

### 변경사항 타입

- **patch** (0.0.1 → 0.0.2): 버그 수정
- **minor** (0.0.1 → 0.1.0): 새로운 기능 추가
- **major** (0.0.1 → 1.0.0): 호환성 깨지는 변경

### 예시

```bash
# UI 컴포넌트 수정
pnpm changeset
# 선택: @pickid/ui
# 타입: patch
# 설명: Button 컴포넌트 스타일 수정

# 새로운 유틸리티 함수 추가
pnpm changeset
# 선택: @pickid/shared
# 타입: minor
# 설명: 새로운 날짜 포맷팅 함수 추가
```

## 자동화

- **GitHub Actions**가 main 브랜치에 푸시될 때 자동으로 릴리스 처리
- **PR이 머지**되면 자동으로 버전 업데이트 및 패키지 발행

## 모범 사례

### 1. 변경사항 관리

- 한 번에 하나의 기능이나 수정사항만 추가
- 변경사항을 명확하고 이해하기 쉽게 설명
- 변경의 영향도를 고려하여 적절한 버전 타입 선택

### 2. 릴리스 관리

- 변경사항이 누적되기 전에 정기적으로 릴리스
- 주요 기능은 별도의 브랜치에서 개발 후 PR로 머지
- 릴리스 전에 충분한 테스트 수행

### 3. 의존성 관리

- 패키지 간 의존성은 `workspace:*` 사용
- 외부 의존성은 최신 안정 버전 사용
- 정기적으로 의존성 업데이트

## 문제 해결

### 버전 충돌

```bash
# 로컬 변경사항 확인
pnpm changeset status

# 변경사항 초기화
rm -rf .changeset
pnpm changeset init
```

### 의존성 문제

```bash
# 의존성 재설치
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### 빌드 오류

```bash
# 캐시 클리어
pnpm store prune
turbo build --force
```

## 설정 파일

### .changeset/config.json

```json
{
	"changelog": "@changesets/cli/changelog",
	"commit": false,
	"access": "public",
	"baseBranch": "main",
	"updateInternalDependencies": "patch"
}
```

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - '!**/node_modules'
  - '!**/dist'
  - '!**/build'
  - '!**/.next'
```

## 참고 자료

- [Changesets 공식 문서](https://github.com/changesets/changesets)
- [pnpm Workspaces 가이드](https://pnpm.io/workspaces)
- [Turborepo 문서](https://turbo.build/repo/docs)

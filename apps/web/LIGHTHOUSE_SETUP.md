# Lighthouse CI 설정 가이드

## 🚀 Lighthouse CI 연결의 장점

### 1. 지속적인 성능 모니터링

- **자동화된 성능 테스트**: PR마다 자동으로 성능 점수 측정
- **성능 회귀 방지**: 코드 변경으로 인한 성능 저하 조기 발견
- **Core Web Vitals 추적**: LCP, FID, CLS 등 핵심 지표 모니터링

### 2. 개발 워크플로우 개선

- **PR 체크리스트**: 성능 점수가 기준 이하일 때 PR 블록
- **성능 리포트**: 각 배포마다 상세한 성능 리포트 제공
- **트렌드 분석**: 시간에 따른 성능 변화 추적

### 3. SEO 및 사용자 경험 향상

- **검색엔진 최적화**: Google이 중요하게 여기는 Core Web Vitals 관리
- **사용자 만족도**: 빠른 로딩 속도로 사용자 경험 개선
- **비즈니스 임팩트**: 성능 개선으로 전환율 및 체류시간 향상

## 📋 설정 방법

### 1. 로컬 설치 및 테스트

```bash
# Lighthouse CI 설치
cd apps/web
pnpm add -D @lhci/cli

# 로컬 테스트
pnpm run perf
```

### 2. GitHub Actions 연동

- `.github/workflows/lighthouse.yml` 파일이 자동으로 생성됨
- PR마다 자동으로 Lighthouse 테스트 실행
- 성능 점수가 기준 이하일 때 PR 블록

### 3. Vercel 연동 (선택사항)

```bash
# Vercel에 Lighthouse CI 앱 설치
# https://github.com/apps/lighthouse-ci

# 환경 변수 설정
LHCI_GITHUB_APP_TOKEN=your_token_here
```

### 4. 성능 기준 설정

현재 설정된 기준:

- **Performance**: 90점 이상
- **Accessibility**: 90점 이상
- **Best Practices**: 90점 이상
- **SEO**: 90점 이상
- **LCP**: 2.5초 이하
- **FID**: 100ms 이하
- **CLS**: 0.1 이하

## 🎯 사용 방법

### 로컬에서 성능 테스트

```bash
# 전체 성능 테스트
pnpm run perf

# 데스크톱 성능 테스트
pnpm run lighthouse:ci

# 모바일 성능 테스트
pnpm run lighthouse:mobile
```

### CI/CD에서 자동 실행

- PR 생성 시 자동으로 Lighthouse 테스트 실행
- 성능 점수가 기준 이하일 때 PR 상태를 "실패"로 표시
- 성능 리포트를 PR 코멘트로 자동 생성

## 📊 결과 확인

### GitHub Actions에서

- Actions 탭에서 Lighthouse CI 실행 결과 확인
- 실패한 경우 상세한 리포트 다운로드 가능

### 로컬에서

- `.lighthouseci/` 폴더에 결과 저장
- HTML 리포트로 상세한 성능 분석 가능

## 🔧 커스터마이징

### 성능 기준 조정

`lighthouserc.json`에서 `assertions` 섹션 수정:

```json
{
	"assertions": {
		"categories:performance": ["error", { "minScore": 0.95 }],
		"largest-contentful-paint": ["error", { "maxNumericValue": 2000 }]
	}
}
```

### 테스트할 URL 추가

`lighthouserc.json`에서 `url` 배열에 추가:

```json
{
	"collect": {
		"url": [
			"http://localhost:3000",
			"http://localhost:3000/tests",
			"http://localhost:3000/mypage",
			"http://localhost:3000/feedback"
		]
	}
}
```

## 🚨 문제 해결

### 일반적인 문제들

1. **타임아웃 오류**: `sleep` 시간을 늘리거나 서버 시작 확인 로직 추가
2. **메모리 부족**: GitHub Actions에서 `runs-on: ubuntu-latest` 사용
3. **네트워크 오류**: 프록시 설정이나 방화벽 확인

### 성능 점수 개선 팁

1. **이미지 최적화**: WebP 포맷 사용, 적절한 크기 설정
2. **코드 스플리팅**: 동적 import로 번들 크기 최적화
3. **캐싱 전략**: 적절한 Cache-Control 헤더 설정
4. **CDN 사용**: 정적 자산을 CDN으로 서빙

# Google Analytics 4 설정 가이드

## 📋 목차

1. [GA4 계정 생성](#1-ga4-계정-생성)
2. [측정 ID 받기](#2-측정-id-받기)
3. [환경변수 설정](#3-환경변수-설정)
4. [이벤트 확인하기](#4-이벤트-확인하기)
5. [주요 이벤트 목록](#5-주요-이벤트-목록)

---

## 1. GA4 계정 생성

### 1-1. Google Analytics 접속

1. https://analytics.google.com 접속
2. Google 계정으로 로그인
3. 좌측 하단 **관리** 클릭

### 1-2. 계정 만들기

```
계정 이름: Pickid (또는 원하는 이름)
✅ 계정 데이터 공유 설정 (선택사항)
```

### 1-3. 속성(Property) 만들기

```
속성 이름: Pickid Web
보고 시간대: 대한민국 (GMT+09:00)
통화: 대한민국 원 (₩)
```

### 1-4. 비즈니스 정보 입력

```
업종: 온라인 커뮤니티
비즈니스 규모: 소규모 (1-10명)
사용 목적: ✅ 사용자 행동 분석
```

### 1-5. 데이터 스트림 설정

```
플랫폼: 웹
웹사이트 URL: https://your-domain.com
스트림 이름: Pickid Web App
✅ 향상된 측정 사용 설정 (권장)
```

---

## 2. 측정 ID 받기

### 데이터 스트림 상세 정보에서 확인

```
측정 ID: G-XXXXXXXXXX
```

이 ID를 복사해두세요!

### 향상된 측정 확인

다음 항목이 자동으로 추적됩니다:

- ✅ 페이지 조회수
- ✅ 스크롤
- ✅ 이탈 클릭
- ✅ 사이트 검색
- ✅ 동영상 참여
- ✅ 파일 다운로드

---

## 3. 환경변수 설정

### 3-1. .env.local 파일 생성

```bash
# apps/web 디렉토리에서
cp env.example .env.local
```

### 3-2. GA_ID 입력

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3-3. 서버 재시작

```bash
pnpm dev
```

---

## 4. 이벤트 확인하기

### 4-1. 실시간 보고서 확인

1. Google Analytics → **실시간** 탭
2. 로컬에서 웹사이트 접속 (http://localhost:3000)
3. 실시간 사용자 수 확인

### 4-2. DebugView 사용 (개발 환경)

브라우저 콘솔에서:

```javascript
// Chrome Extension: Google Analytics Debugger 설치 후
// 자동으로 debug_mode 활성화됨
```

또는 URL 파라미터로:

```
http://localhost:3000?debug_mode=true
```

### 4-3. 이벤트 로그 확인

Google Analytics → **관리** → **DebugView**

---

## 5. 주요 이벤트 목록

### 자동 추적 이벤트 (향상된 측정)

| 이벤트명        | 설명              |
| --------------- | ----------------- |
| `page_view`     | 페이지 조회       |
| `scroll`        | 페이지 90% 스크롤 |
| `click`         | 이탈 클릭         |
| `first_visit`   | 최초 방문         |
| `session_start` | 세션 시작         |

### 커스텀 이벤트 (구현됨)

| 이벤트명          | 카테고리   | 설명          | 트리거 위치          |
| ----------------- | ---------- | ------------- | -------------------- |
| `test_start`      | engagement | 테스트 시작   | 시작 버튼 클릭       |
| `test_complete`   | engagement | 테스트 완료   | 마지막 질문 제출     |
| `question_answer` | engagement | 질문 응답     | 각 질문 답변         |
| `result_viewed`   | engagement | 결과 조회     | 결과 페이지 진입     |
| `result_shared`   | social     | 결과 공유     | 공유 버튼 클릭       |
| `category_view`   | navigation | 카테고리 조회 | 카테고리 페이지 진입 |

---

## 📊 유용한 GA4 보고서

### 1. 실시간

- 실시간 사용자 수
- 활성 이벤트
- 트래픽 소스

### 2. 수명 주기 → 참여도

- **이벤트**: 커스텀 이벤트 확인
- **전환**: 주요 이벤트를 전환으로 표시
- **페이지 및 화면**: 페이지별 조회수

### 3. 수명 주기 → 획득

- **트래픽 획득**: 유입 경로 분석
- **사용자 획득**: 신규 사용자 유입

### 4. 사용자 → 기술

- **기기 카테고리**: Mobile/Desktop/Tablet
- **브라우저**: Chrome, Safari 등
- **OS**: iOS, Android, Windows 등

### 5. 사용자 → 인구통계

- **지역**: 국가/도시별 통계
- **언어**: 사용자 언어

---

## 🎯 권장 설정

### 전환 이벤트 설정

다음 이벤트를 **전환**으로 표시 권장:

1. `test_complete` - 테스트 완료
2. `result_shared` - 결과 공유

설정 방법:

1. **관리** → **이벤트**
2. 해당 이벤트 클릭 → **전환으로 표시**

### 맞춤 측정기준 (Custom Dimensions)

필요 시 추가 가능:

- `test_id`: 테스트 ID
- `result_type`: 결과 타입
- `user_gender`: 사용자 성별

---

## 🔍 문제 해결

### 이벤트가 보이지 않을 때

1. **24시간 대기**: 새 속성은 최대 24시간 소요
2. **DebugView 확인**: 실시간으로 이벤트 확인
3. **측정 ID 확인**: .env.local 파일 확인
4. **서버 재시작**: 환경변수 변경 후 필수

### 실시간에는 보이는데 보고서에는 없을 때

- 보고서는 최대 24-48시간 지연됨
- DebugView와 실시간 보고서 활용

---

## 📚 참고 자료

- [GA4 공식 문서](https://support.google.com/analytics/answer/9304153)
- [Next.js Google Analytics 가이드](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [gtag.js 이벤트 참조](https://developers.google.com/analytics/devguides/collection/gtagjs/events)

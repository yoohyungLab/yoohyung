# 아키텍처 컨벤션

본 프로젝트는 **Monorepo(Turborepo)** 기반이며, 각 앱별로 다른 아키텍처 패턴을 사용합니다.

---

## 앱별 아키텍처

### Web 앱: **FSD + MVVM**

- **구조**: Feature-Sliced Design + MVVM 역할 규칙
- **특징**: 기능별 모듈화, 도메인 중심 설계

### Admin 앱: **레이어드 아키텍처**

- **구조**: Presentation → Business Logic → Data Access → Infrastructure
- **특징**: 계층별 명확한 책임 분리, 단순한 관리자 도구에 최적화

---

## 공통 원칙

### 레이어 규칙

- **View Layer**: UI 렌더링만 담당
- **Business Logic Layer**: 상태 관리 & 비즈니스 규칙
- **Data Access Layer**: API 호출 & 데이터 변환
- **Infrastructure Layer**: 유틸리티 & 외부 라이브러리

### 의존성 방향

```
View → Business Logic → Data Access → Infrastructure
```

---

## 공용 패키지

| 패키지               | 역할               |
| -------------------- | ------------------ |
| `packages/ui/`       | 공통 UI 컴포넌트   |
| `packages/shared/`   | 공통 유틸리티      |
| `packages/supabase/` | 데이터 접근 레이어 |
| `packages/types/`    | 공통 타입 정의     |
| `packages/config/`   | 공통 설정          |

---

## 보안

- **Supabase RLS** 항상 활성화
- **레이어 간 의존성** 규칙 준수
- **외부 API 호출**은 적절한 레이어를 통해만 가능
- **관리자 권한** 관리자만 대시보드 통계 조회 가능

---

## 백엔드 설정

### 데이터베이스 함수 설정

대시보드 기능을 사용하려면 다음 SQL 파일들을 Supabase SQL Editor에서 실행해야 합니다:

1. **`supabase-functions.sql`** - 대시보드 통계용 데이터베이스 함수들
2. **`supabase-rls-policies.sql`** - RLS 정책 및 관리자 권한 설정
3. **`supabase/migrations/20250111000000_add_test_counters.sql`** - 테스트 조회/참여 카운터 함수

### 실행 순서

```sql
-- 1. 데이터베이스 함수 생성
-- supabase-functions.sql 실행

-- 2. RLS 정책 및 권한 설정
-- supabase-rls-policies.sql 실행

-- 3. 테스트 카운터 함수 (조회/참여)
-- supabase/migrations/20250111000000_add_test_counters.sql 실행
```

### 주요 함수들

- `get_dashboard_stats()` - 대시보드 핵심 통계 조회
- `get_top_tests_today(limit)` - 오늘의 인기 테스트 조회
- `get_dashboard_alerts()` - 대시보드 알림 조회
- `get_test_detailed_stats(test_uuid)` - 테스트별 상세 통계
- `is_admin_user()` - 관리자 권한 확인
- `increment_test_start(test_uuid)` - "시작하기" 버튼 클릭 시 시작 횟수 증가
- `increment_test_response(test_uuid)` - 결과 보기 완료 시 완료 횟수 증가

### 프론트 반영 지표

- Web 표시
  - 시작 횟수(starts): `tests.start_count` ("시작하기" 버튼 클릭 기준)
  - 완료 횟수(completions): `tests.response_count` (결과 보기 완료 기준)
- Admin 표시
  - 목록 및 상세에 조회수/참여수 모두 노출

### 성능 최적화

자동으로 생성되는 인덱스들:

- `idx_user_test_responses_created_date`
- `idx_user_test_responses_test_id_created_date`
- `idx_user_test_responses_session_id_created_date`
- `idx_tests_status`
- `idx_user_test_responses_completed_at`

# 데이터베이스 스키마 정보 & 테이블 구조

### admin_users 테이블

| 필드명        | 타입                     | 제약조건 | 설명                 |
| ------------- | ------------------------ | -------- | -------------------- |
| id            | uuid                     | NOT NULL | 고유 식별자          |
| username      | character varying        | NOT NULL | 관리자 로그인 아이디 |
| password_hash | character varying        | NOT NULL | 암호화된 비밀번호    |
| email         | character varying        | -        | 관리자 이메일        |
| name          | character varying        | NOT NULL | 관리자 실명          |
| is_active     | boolean                  | -        | 계정 활성화 상태     |
| created_at    | timestamp with time zone | -        | 생성일시             |
| updated_at    | timestamp with time zone | -        | 수정일시             |

### categories 테이블

| 필드명     | 타입                     | 제약조건         | 설명                                           |
| ---------- | ------------------------ | ---------------- | ---------------------------------------------- |
| id         | uuid                     | NOT NULL         | 고유 식별자                                    |
| name       | character varying        | NOT NULL         | 카테고리 명                                    |
| slug       | character varying        | NOT NULL, UNIQUE | URL 슬러그 (예: psychology, personality, love) |
| sort_order | integer                  | -                | 정렬 순서                                      |
| created_at | timestamp with time zone | NOT NULL         | 생성일시                                       |
| updated_at | timestamp with time zone | NOT NULL         | 수정일시                                       |
| status     | category_status          | NOT NULL         | 카테고리 상태 (기본값: active)                 |

### favorites 테이블

| 필드명     | 타입                     | 제약조건 | 설명                  |
| ---------- | ------------------------ | -------- | --------------------- |
| id         | uuid                     | NOT NULL | 고유 식별자           |
| created_at | timestamp with time zone | NOT NULL | 생성일시              |
| content_id | text                     | -        | 컨텐츠 ID (테스트 ID) |
| user_id    | uuid                     | -        | 사용자 ID             |

### feedbacks 테이블

| 필드명            | 타입                     | 제약조건 | 설명            |
| ----------------- | ------------------------ | -------- | --------------- |
| id                | uuid                     | NOT NULL | 고유 식별자     |
| title             | character varying        | NOT NULL | 피드백 제목     |
| content           | text                     | NOT NULL | 피드백 내용     |
| category          | character varying        | NOT NULL | 피드백 분류     |
| status            | character varying        | NOT NULL | 처리 상태       |
| author_name       | character varying        | -        | 작성자 이름     |
| author_email      | character varying        | -        | 작성자 이메일   |
| attached_file_url | character varying        | -        | 첨부파일 URL    |
| admin_reply       | text                     | -        | 관리자 답변     |
| admin_reply_at    | timestamp with time zone | -        | 관리자 답변일시 |
| views             | integer                  | -        | 조회수          |
| created_at        | timestamp with time zone | NOT NULL | 생성일시        |
| updated_at        | timestamp with time zone | NOT NULL | 수정일시        |

### users 테이블

| 필드명     | 타입                     | 제약조건 | 설명                        |
| ---------- | ------------------------ | -------- | --------------------------- |
| id         | uuid                     | NOT NULL | 고유 식별자                 |
| email      | text                     | -        | 사용자 이메일               |
| name       | text                     | -        | 사용자 이름                 |
| avatar_url | text                     | -        | 프로필 이미지 URL           |
| provider   | character varying        | NOT NULL | 인증 제공자 (기본값: email) |
| created_at | timestamp with time zone | -        | 생성일시                    |
| updated_at | timestamp with time zone | -        | 수정일시                    |
| status     | character varying        | -        | 계정 상태 (기본값: active)  |

### test_choices 테이블

| 필드명       | 타입                        | 제약조건 | 설명               |
| ------------ | --------------------------- | -------- | ------------------ |
| id           | uuid                        | NOT NULL | 고유 식별자        |
| question_id  | uuid                        | -        | 질문 참조          |
| choice_text  | text                        | NOT NULL | 선택지 내용        |
| choice_order | integer                     | NOT NULL | 선택지 순서        |
| score        | integer                     | -        | 점수값 (기본값: 0) |
| is_correct   | boolean                     | -        | 정답 여부 (퀴즈용) |
| created_at   | timestamp without time zone | -        | 생성일시           |

### test_questions 테이블

| 필드명         | 타입                        | 제약조건 | 설명            |
| -------------- | --------------------------- | -------- | --------------- |
| id             | uuid                        | NOT NULL | 고유 식별자     |
| test_id        | uuid                        | -        | 테스트 참조     |
| question_text  | text                        | NOT NULL | 질문 내용       |
| question_order | integer                     | NOT NULL | 질문 순서       |
| image_url      | text                        | -        | 질문 이미지 URL |
| created_at     | timestamp without time zone | -        | 생성일시        |
| updated_at     | timestamp without time zone | -        | 수정일시        |

### test_results 테이블

| 필드명               | 타입                        | 제약조건 | 설명                         |
| -------------------- | --------------------------- | -------- | ---------------------------- |
| id                   | uuid                        | NOT NULL | 고유 식별자                  |
| test_id              | uuid                        | -        | 테스트 참조                  |
| result_name          | text                        | NOT NULL | 결과 이름                    |
| result_order         | integer                     | NOT NULL | 결과 순서                    |
| description          | text                        | -        | 결과 설명                    |
| match_conditions     | jsonb                       | -        | 매칭 조건 (기본값: {})       |
| background_image_url | text                        | -        | 배경 이미지 URL              |
| theme_color          | character varying(7)        | -        | 테마 색상 (HEX)              |
| features             | jsonb                       | -        | 특징 (JSON)                  |
| target_gender        | character varying(10)       | -        | 타겟 성별 (male/female/NULL) |
| created_at           | timestamp without time zone | -        | 생성일시                     |
| updated_at           | timestamp without time zone | -        | 수정일시                     |

### tests 테이블

| 필드명          | 타입                     | 제약조건 | 설명                                |
| --------------- | ------------------------ | -------- | ----------------------------------- |
| id              | uuid                     | NOT NULL | 고유 식별자                         |
| title           | character varying        | NOT NULL | 테스트 제목                         |
| description     | text                     | -        | 테스트 설명                         |
| slug            | character varying        | NOT NULL | URL 슬러그                          |
| thumbnail_url   | text                     | -        | 썸네일 이미지 URL                   |
| response_count  | integer                  | -        | 완료 횟수 (기본값: 0)               |
| start_count     | integer                  | -        | 시작 횟수 (기본값: 0)               |
| category_ids    | ARRAY                    | -        | 카테고리 ID 배열                    |
| short_code      | character varying        | -        | 짧은 코드                           |
| intro_text      | text                     | -        | 테스트 시작 문구                    |
| status          | character varying        | -        | 발행 상태 (기본값: draft)           |
| estimated_time  | integer                  | -        | 예상 소요 시간 (분)                 |
| scheduled_at    | timestamp with time zone | -        | 예약 발행 시간                      |
| max_score       | integer                  | -        | 최대 점수 (심리 테스트용)           |
| type            | character varying        | -        | 테스트 타입 (기본값: psychology)    |
| published_at    | timestamp with time zone | -        | 발행일시                            |
| requires_gender | boolean                  | NOT NULL | 성별 정보 수집 여부 (기본값: false) |
| created_at      | timestamp with time zone | NOT NULL | 생성일시                            |
| updated_at      | timestamp with time zone | NOT NULL | 수정일시                            |

### uploads 테이블

| 필드명      | 타입                     | 제약조건 | 설명               |
| ----------- | ------------------------ | -------- | ------------------ |
| id          | uuid                     | NOT NULL | 고유 식별자        |
| filename    | character varying        | NOT NULL | 파일명             |
| path        | text                     | NOT NULL | 파일 경로          |
| url         | text                     | NOT NULL | 파일 URL           |
| size        | integer                  | NOT NULL | 파일 크기          |
| type        | character varying        | NOT NULL | 파일 타입          |
| uploaded_by | uuid                     | -        | 업로드한 사용자 ID |
| created_at  | timestamp with time zone | -        | 생성일시           |

### user_test_responses 테이블

| 필드명                  | 타입                     | 제약조건 | 설명                           |
| ----------------------- | ------------------------ | -------- | ------------------------------ |
| id                      | uuid                     | NOT NULL | 고유 식별자                    |
| test_id                 | uuid                     | -        | 테스트 참조                    |
| user_id                 | uuid                     | -        | 사용자 ID (익명 가능)          |
| session_id              | text                     | NOT NULL | 세션 추적 ID                   |
| result_id               | uuid                     | -        | 결과 참조                      |
| total_score             | integer                  | -        | 총 점수                        |
| started_at              | timestamp with time zone | -        | 시작 시간                      |
| completed_at            | timestamp with time zone | -        | 완료 시간                      |
| completion_time_seconds | integer                  | -        | 완료 소요 시간 (초)            |
| ip_address              | inet                     | -        | IP 주소                        |
| user_agent              | text                     | -        | 사용자 에이전트                |
| referrer                | text                     | -        | 리퍼러                         |
| device_type             | character varying(20)    | -        | 디바이스 타입                  |
| responses               | jsonb                    | NOT NULL | 실제 답변 데이터               |
| created_date            | date                     | -        | 생성 날짜                      |
| gender                  | character varying(10)    | -        | 사용자 성별 (male/female/NULL) |
| created_at              | timestamp with time zone | -        | 생성일시                       |

---

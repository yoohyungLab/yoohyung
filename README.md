# 테스트 관리 시스템 데이터베이스 스키마 문서

## 개요

-   **프로젝트**: 온라인 테스트 관리 시스템
-   **데이터베이스**: PostgreSQL
-   **생성일**: 2025-09-15
-   **버전**: 1.1 (실제 스키마 반영)
-   **총 테이블 수**: 11개 (뷰 포함)

## 테이블 구조 요약

| 테이블명            | 설명             | 필드 수 | 주요 관계             |
| ------------------- | ---------------- | ------- | --------------------- |
| admin_users         | 관리자 계정 관리 | 10      | -                     |
| categories          | 테스트 카테고리  | 11      | ← tests               |
| favorites           | 사용자 즐겨찾기  | 4       | -                     |
| feedbacks           | 사용자 피드백    | 12      | -                     |
| profiles            | 사용자 프로필    | 8       | -                     |
| tests               | 메인 테스트 정보 | 21      | → categories          |
| test_questions      | 테스트 질문      | 10      | → tests               |
| test_choices        | 질문별 선택지    | 9       | → test_questions      |
| test_results        | 테스트 결과 정의 | 17      | → tests               |
| user_test_responses | 사용자 응답      | 15      | → tests, test_results |
| tests_list          | 테스트 목록 뷰   | 14      | VIEW                  |
| test_statistics     | 테스트 통계 뷰   | 7       | VIEW                  |

## 데이터베이스 ERD 관계

```
categories ←─── tests ←─── test_questions ←─── test_choices
    ↑              ↑
    │              └─── test_results ←─── user_test_responses
    │                        ↑                    ↑
profiles ←─────────────────────┘                  │
    ↑                                           │
favorites                                       │
feedbacks                                       │
admin_users                                     │
                                               │
session_id ─────────────────────────────────────┘

[VIEWS]
tests_list ← JOIN(tests, categories, question/result counts)
test_statistics ← COMPUTED(user_test_responses aggregation)
```

---

## 상세 테이블 정보

### 1. admin_users - 관리자 계정

**목적**: 시스템 관리자 계정 정보 저장 및 인증

| 필드명        | 타입                     | 설명                      | 제약조건         |
| ------------- | ------------------------ | ------------------------- | ---------------- |
| id            | UUID                     | 고유 식별자               | PRIMARY KEY      |
| username      | CHARACTER VARYING        | 관리자 로그인 아이디      | NOT NULL, UNIQUE |
| password_hash | CHARACTER VARYING        | 암호화된 비밀번호         | NOT NULL         |
| email         | CHARACTER VARYING        | 관리자 이메일             | NULLABLE         |
| name          | CHARACTER VARYING        | 관리자 실명               | NOT NULL         |
| role          | CHARACTER VARYING        | 역할 (admin, super_admin) | NULLABLE         |
| is_active     | BOOLEAN                  | 계정 활성화 상태          | NULLABLE         |
| last_login    | TIMESTAMP WITH TIME ZONE | 마지막 로그인 시간        | NULLABLE         |
| created_at    | TIMESTAMP WITH TIME ZONE | 생성일시                  | NULLABLE         |
| updated_at    | TIMESTAMP WITH TIME ZONE | 수정일시                  | NULLABLE         |

**사용 예시**:

```sql
-- 관리자 인증
SELECT id, name, role FROM admin_users
WHERE username = ? AND is_active = true;

-- 관리자 활동 로그
UPDATE admin_users SET last_login = NOW() WHERE id = ?;
```

---

### 2. categories - 테스트 카테고리

**목적**: 테스트 분류 및 카테고리 관리

| 필드명        | 타입                     | 설명              | 제약조건    |
| ------------- | ------------------------ | ----------------- | ----------- |
| id            | UUID                     | 고유 식별자       | PRIMARY KEY |
| name          | CHARACTER VARYING        | 카테고리 명       | NOT NULL    |
| slug          | CHARACTER VARYING        | URL 슬러그        | NOT NULL    |
| description   | TEXT                     | 카테고리 설명     | NULLABLE    |
| sort_order    | INTEGER                  | 정렬 순서         | NULLABLE    |
| is_active     | BOOLEAN                  | 활성화 상태       | NULLABLE    |
| created_at    | TIMESTAMP WITH TIME ZONE | 생성일시          | NOT NULL    |
| updated_at    | TIMESTAMP WITH TIME ZONE | 수정일시          | NOT NULL    |
| icon_url      | TEXT                     | 아이콘 이미지 URL | NULLABLE    |
| banner_url    | TEXT                     | 배너 이미지 URL   | NULLABLE    |
| thumbnail_url | TEXT                     | 썸네일 이미지 URL | NULLABLE    |

**사용 예시**:

```sql
-- 활성 카테고리 목록
SELECT * FROM categories WHERE is_active = true ORDER BY sort_order;

-- 카테고리별 테스트 수
SELECT c.name, COUNT(t.id) as test_count
FROM categories c
LEFT JOIN tests t ON c.id = t.category_id
GROUP BY c.id, c.name;
```

---

### 3. favorites - 사용자 즐겨찾기

**목적**: 사용자의 즐겨찾기 테스트 관리

| 필드명     | 타입                     | 설명                  | 제약조건    |
| ---------- | ------------------------ | --------------------- | ----------- |
| id         | UUID                     | 고유 식별자           | PRIMARY KEY |
| created_at | TIMESTAMP WITH TIME ZONE | 생성일시              | NOT NULL    |
| content_id | TEXT                     | 컨텐츠 ID (테스트 ID) | NULLABLE    |
| user_id    | UUID                     | 사용자 ID             | NULLABLE    |

**사용 예시**:

```sql
-- 사용자 즐겨찾기 목록
SELECT f.*, t.title FROM favorites f
JOIN tests t ON f.content_id = t.id::text
WHERE f.user_id = ?;
```

---

### 4. feedbacks - 사용자 피드백

**목적**: 사용자 의견 및 피드백 관리

| 필드명            | 타입                     | 설명            | 제약조건    |
| ----------------- | ------------------------ | --------------- | ----------- |
| id                | UUID                     | 고유 식별자     | PRIMARY KEY |
| title             | CHARACTER VARYING        | 피드백 제목     | NOT NULL    |
| content           | TEXT                     | 피드백 내용     | NOT NULL    |
| category          | CHARACTER VARYING        | 피드백 분류     | NOT NULL    |
| status            | CHARACTER VARYING        | 처리 상태       | NOT NULL    |
| author_name       | CHARACTER VARYING        | 작성자 이름     | NULLABLE    |
| author_email      | CHARACTER VARYING        | 작성자 이메일   | NULLABLE    |
| attached_file_url | CHARACTER VARYING        | 첨부파일 URL    | NULLABLE    |
| admin_reply       | TEXT                     | 관리자 답변     | NULLABLE    |
| admin_reply_at    | TIMESTAMP WITH TIME ZONE | 관리자 답변일시 | NULLABLE    |
| views             | INTEGER                  | 조회수          | NULLABLE    |
| created_at        | TIMESTAMP WITH TIME ZONE | 생성일시        | NOT NULL    |
| updated_at        | TIMESTAMP WITH TIME ZONE | 수정일시        | NOT NULL    |

**사용 예시**:

```sql
-- 대기 중인 피드백
SELECT * FROM feedbacks WHERE status = 'pending' ORDER BY created_at;

-- 피드백 답변 처리
UPDATE feedbacks SET
    admin_reply = ?,
    admin_reply_at = NOW(),
    status = 'answered'
WHERE id = ?;
```

---

### 5. profiles - 사용자 프로필

**목적**: 일반 사용자 프로필 정보 관리

| 필드명     | 타입                     | 설명              | 제약조건    |
| ---------- | ------------------------ | ----------------- | ----------- |
| id         | UUID                     | 고유 식별자       | PRIMARY KEY |
| email      | TEXT                     | 사용자 이메일     | NULLABLE    |
| name       | TEXT                     | 사용자 이름       | NULLABLE    |
| avatar_url | TEXT                     | 프로필 이미지 URL | NULLABLE    |
| provider   | TEXT                     | 인증 제공자       | NULLABLE    |
| created_at | TIMESTAMP WITH TIME ZONE | 생성일시          | NULLABLE    |
| updated_at | TIMESTAMP WITH TIME ZONE | 수정일시          | NULLABLE    |
| status     | CHARACTER VARYING        | 계정 상태         | NULLABLE    |

---

### 6. tests - 메인 테스트 정보

**목적**: 테스트의 기본 정보 및 메타데이터 관리

| 필드명           | 타입                        | 설명               | 제약조건          |
| ---------------- | --------------------------- | ------------------ | ----------------- |
| id               | UUID                        | 고유 식별자        | PRIMARY KEY       |
| title            | CHARACTER VARYING           | 테스트 제목        | NOT NULL          |
| description      | TEXT                        | 테스트 설명        | NULLABLE          |
| slug             | CHARACTER VARYING           | URL 슬러그         | NOT NULL          |
| created_at       | TIMESTAMP WITH TIME ZONE    | 생성일시           | NOT NULL          |
| updated_at       | TIMESTAMP WITH TIME ZONE    | 수정일시           | NOT NULL          |
| category_id      | UUID                        | 카테고리 참조      | FK: categories.id |
| type             | CHARACTER VARYING           | 테스트 유형        | NULLABLE          |
| thumbnail_url    | TEXT                        | 썸네일 이미지 URL  | NULLABLE          |
| banner_image_url | TEXT                        | 배너 이미지 URL    | NULLABLE          |
| og_image_url     | TEXT                        | OG 이미지 URL      | NULLABLE          |
| intro_text       | TEXT                        | 테스트 소개 텍스트 | NULLABLE          |
| status           | CHARACTER VARYING           | 발행 상태          | NULLABLE          |
| response_count   | INTEGER                     | 응답 수            | NULLABLE          |
| view_count       | INTEGER                     | 조회수             | NULLABLE          |
| estimated_time   | INTEGER                     | 예상 소요시간(분)  | NULLABLE          |
| max_score        | INTEGER                     | 최대 점수          | NULLABLE          |
| scheduled_at     | TIMESTAMP WITHOUT TIME ZONE | 예약 발행 시간     | NULLABLE          |
| completion_count | INTEGER                     | 완료 수            | NULLABLE          |
| author_id        | UUID                        | 작성자 ID          | NULLABLE          |
| tags             | ARRAY                       | 태그 배열          | NULLABLE          |
| share_count      | INTEGER                     | 공유 수            | DEFAULT 0         |

**주요 사용 패턴**:

```sql
-- 인기 테스트 조회 (완료수, 공유수, 조회수 기준)
SELECT * FROM tests
WHERE status = 'published'
ORDER BY completion_count DESC, share_count DESC, view_count DESC
LIMIT 10;

-- 카테고리별 테스트
SELECT t.*, c.name as category_name
FROM tests t
JOIN categories c ON t.category_id = c.id
WHERE c.slug = 'personality';

-- 테스트 조회수 증가
UPDATE tests SET view_count = view_count + 1 WHERE id = ?;

-- 테스트 공유수 증가
UPDATE tests SET share_count = share_count + 1 WHERE id = ?;
```

---

### 7. test_questions - 테스트 질문

**목적**: 각 테스트의 질문 정보 저장

| 필드명         | 타입                        | 설명                 | 제약조건     |
| -------------- | --------------------------- | -------------------- | ------------ |
| id             | UUID                        | 고유 식별자          | PRIMARY KEY  |
| test_id        | UUID                        | 테스트 참조          | FK: tests.id |
| question_text  | TEXT                        | 질문 내용            | NOT NULL     |
| question_order | INTEGER                     | 질문 순서            | NOT NULL     |
| image_url      | TEXT                        | 질문 이미지 URL      | NULLABLE     |
| question_group | TEXT                        | 질문 그룹 (선택사항) | NULLABLE     |
| required       | BOOLEAN                     | 필수 답변 여부       | NULLABLE     |
| settings       | JSONB                       | 질문별 설정          | NULLABLE     |
| created_at     | TIMESTAMP WITHOUT TIME ZONE | 생성일시             | NULLABLE     |
| updated_at     | TIMESTAMP WITHOUT TIME ZONE | 수정일시             | NULLABLE     |

**사용 예시**:

```sql
-- 테스트의 모든 질문 조회
SELECT * FROM test_questions
WHERE test_id = ?
ORDER BY question_order;

-- 질문별 선택지 수 확인
SELECT q.id, q.question_text, COUNT(c.id) as choice_count
FROM test_questions q
LEFT JOIN test_choices c ON q.id = c.question_id
WHERE q.test_id = ?
GROUP BY q.id, q.question_text
ORDER BY q.question_order;
```

---

### 8. test_choices - 질문별 선택지

**목적**: 각 질문의 선택지 정보 및 점수 매핑

| 필드명         | 타입                        | 설명               | 제약조건              |
| -------------- | --------------------------- | ------------------ | --------------------- |
| id             | UUID                        | 고유 식별자        | PRIMARY KEY           |
| question_id    | UUID                        | 질문 참조          | FK: test_questions.id |
| choice_text    | TEXT                        | 선택지 내용        | NOT NULL              |
| choice_order   | INTEGER                     | 선택지 순서        | NOT NULL              |
| image_url      | TEXT                        | 선택지 이미지 URL  | NULLABLE              |
| score          | INTEGER                     | 점수값             | NULLABLE              |
| is_correct     | BOOLEAN                     | 정답 여부 (퀴즈형) | NULLABLE              |
| result_mapping | JSONB                       | 결과 매핑 정보     | NULLABLE              |
| created_at     | TIMESTAMP WITHOUT TIME ZONE | 생성일시           | NULLABLE              |

**사용 예시**:

```sql
-- 질문의 선택지 조회
SELECT * FROM test_choices
WHERE question_id = ?
ORDER BY choice_order;

-- 점수 계산용 선택지 정보
SELECT c.*, q.question_text
FROM test_choices c
JOIN test_questions q ON c.question_id = q.id
WHERE q.test_id = ?
ORDER BY q.question_order, c.choice_order;
```

---

### 9. test_results - 테스트 결과 정의

**목적**: 테스트 결과 유형 및 조건 정의

| 필드명               | 타입                        | 설명              | 제약조건     |
| -------------------- | --------------------------- | ----------------- | ------------ |
| id                   | UUID                        | 고유 식별자       | PRIMARY KEY  |
| test_id              | UUID                        | 테스트 참조       | FK: tests.id |
| result_name          | TEXT                        | 결과 이름         | NOT NULL     |
| result_order         | INTEGER                     | 결과 순서         | NOT NULL     |
| description          | TEXT                        | 결과 설명         | NULLABLE     |
| features             | ARRAY                       | 특징 배열         | NULLABLE     |
| match_conditions     | JSONB                       | 매칭 조건         | NULLABLE     |
| background_image_url | TEXT                        | 배경 이미지 URL   | NULLABLE     |
| theme_color          | TEXT                        | 테마 색상         | NULLABLE     |
| emoji                | TEXT                        | 대표 이모지       | NULLABLE     |
| keywords             | ARRAY                       | 키워드 배열       | NULLABLE     |
| jobs                 | ARRAY                       | 추천 직업 배열    | NULLABLE     |
| percentage           | NUMERIC                     | 해당 결과 비율    | NULLABLE     |
| meta_description     | TEXT                        | SEO 메타 설명     | NULLABLE     |
| share_image_url      | TEXT                        | 공유용 이미지 URL | NULLABLE     |
| created_at           | TIMESTAMP WITHOUT TIME ZONE | 생성일시          | NULLABLE     |
| updated_at           | TIMESTAMP WITHOUT TIME ZONE | 수정일시          | NULLABLE     |

**사용 예시**:

```sql
-- 점수에 따른 결과 찾기
SELECT * FROM test_results
WHERE test_id = ? AND
      JSON_EXTRACT_PATH_TEXT(match_conditions, 'min_score')::int <= ? AND
      JSON_EXTRACT_PATH_TEXT(match_conditions, 'max_score')::int >= ?
ORDER BY result_order;

-- 결과별 통계
SELECT result_name, percentage, COUNT(*) as response_count
FROM test_results tr
LEFT JOIN user_test_responses utr ON tr.id = utr.result_id
WHERE tr.test_id = ?
GROUP BY tr.id, result_name, percentage;
```

---

### 10. user_test_responses - 사용자 테스트 응답

**목적**: 사용자의 테스트 응답 및 결과 저장

| 필드명                  | 타입                        | 설명                   | 제약조건            |
| ----------------------- | --------------------------- | ---------------------- | ------------------- |
| id                      | UUID                        | 고유 식별자            | PRIMARY KEY         |
| test_id                 | UUID                        | 테스트 참조            | FK: tests.id        |
| user_id                 | UUID                        | 사용자 ID (익명 가능)  | NULLABLE            |
| session_id              | TEXT                        | 세션 추적 ID           | NOT NULL            |
| total_score             | INTEGER                     | 총 점수                | NULLABLE            |
| result_id               | UUID                        | 결과 참조              | FK: test_results.id |
| started_at              | TIMESTAMP WITHOUT TIME ZONE | 시작 시간              | NULLABLE            |
| completed_at            | TIMESTAMP WITHOUT TIME ZONE | 완료 시간              | NULLABLE            |
| completion_time_seconds | INTEGER                     | 소요 시간 (초)         | NULLABLE            |
| ip_address              | INET                        | IP 주소                | NULLABLE            |
| user_agent              | TEXT                        | 브라우저 정보          | NULLABLE            |
| referrer                | TEXT                        | 유입 경로              | NULLABLE            |
| device_type             | CHARACTER VARYING           | 디바이스 유형          | NULLABLE            |
| responses               | JSONB                       | 실제 답변 데이터       | NOT NULL            |
| created_date            | DATE                        | 생성 날짜 (파티셔닝용) | NULLABLE            |

**응답 데이터 구조 예시**:

```json
{
    "answers": [
        {
            "question_id": "uuid1",
            "choice_id": "uuid2",
            "score": 5
        }
    ],
    "metadata": {
        "browser": "Chrome",
        "screen_resolution": "1920x1080"
    }
}
```

---

### 11. tests_list - 테스트 목록 뷰 (VIEW)

**목적**: 테스트 목록 조회를 위한 최적화된 뷰

| 필드명           | 타입                     | 설명       | 계산방식               |
| ---------------- | ------------------------ | ---------- | ---------------------- |
| id               | UUID                     | 테스트 ID  | tests.id               |
| title            | CHARACTER VARYING        | 제목       | tests.title            |
| description      | TEXT                     | 설명       | tests.description      |
| slug             | CHARACTER VARYING        | 슬러그     | tests.slug             |
| type             | CHARACTER VARYING        | 유형       | tests.type             |
| status           | CHARACTER VARYING        | 상태       | tests.status           |
| thumbnail_url    | TEXT                     | 썸네일 URL | tests.thumbnail_url    |
| estimated_time   | INTEGER                  | 예상 시간  | tests.estimated_time   |
| view_count       | INTEGER                  | 조회수     | tests.view_count       |
| completion_count | INTEGER                  | 완료수     | tests.completion_count |
| created_at       | TIMESTAMP WITH TIME ZONE | 생성일     | tests.created_at       |
| category_name    | CHARACTER VARYING        | 카테고리명 | categories.name        |
| question_count   | BIGINT                   | 질문 수    | COUNT(test_questions)  |
| result_count     | BIGINT                   | 결과 수    | COUNT(test_results)    |

---

### 12. test_statistics - 테스트 통계 뷰 (VIEW)

**목적**: 테스트별 통계 정보 제공

| 필드명              | 타입              | 설명          | 계산방식                                 |
| ------------------- | ----------------- | ------------- | ---------------------------------------- |
| id                  | UUID              | 테스트 ID     | tests.id                                 |
| title               | CHARACTER VARYING | 제목          | tests.title                              |
| status              | CHARACTER VARYING | 상태          | tests.status                             |
| response_count      | BIGINT            | 응답 수       | COUNT(user_test_responses)               |
| completion_count    | BIGINT            | 완료 수       | COUNT(완료된 user_test_responses)        |
| completion_rate     | NUMERIC           | 완료율        | completion_count / response_count \* 100 |
| avg_completion_time | NUMERIC           | 평균 완료시간 | AVG(completion_time_seconds)             |

---

## 인덱스 및 성능 최적화

### 주요 인덱스

```sql
-- tests 테이블
CREATE INDEX idx_tests_status_category ON tests(status, category_id);
CREATE INDEX idx_tests_completion_count ON tests(completion_count DESC);
CREATE INDEX idx_tests_share_count ON tests(share_count DESC);
CREATE INDEX idx_tests_slug ON tests(slug);

-- test_questions 테이블
CREATE INDEX idx_questions_test_order ON test_questions(test_id, question_order);

-- test_choices 테이블
CREATE INDEX idx_choices_question_order ON test_choices(question_id, choice_order);

-- user_test_responses 테이블
CREATE INDEX idx_responses_test_completed ON user_test_responses(test_id, completed_at);
CREATE INDEX idx_responses_date ON user_test_responses(created_date);
CREATE INDEX idx_responses_session ON user_test_responses(session_id);

-- 카테고리 테이블
CREATE INDEX idx_categories_active_order ON categories(is_active, sort_order);
```

### 성능 권장사항

1. **대용량 응답 데이터**: `user_test_responses` 테이블은 날짜별 파티셔닝 고려
2. **JSONB 인덱스**: 자주 조회되는 JSONB 필드에 GIN 인덱스 추가
3. **캐싱 전략**: 인기 테스트는 Redis 캐싱 활용
4. **뷰 활용**: `tests_list`, `test_statistics` 뷰를 통한 최적화된 조회

---

## 데이터 흐름

### 테스트 생성 과정

1. `tests` 테이블에 기본 정보 입력
2. `test_questions` 테이블에 질문들 추가
3. `test_choices` 테이블에 각 질문의 선택지들 추가
4. `test_results` 테이블에 결과 유형들 정의
5. 테스트 상태를 'published'로 변경

### 사용자 테스트 진행 과정

1. 테스트 시작시 `user_test_responses` 레코드 생성 (started_at 설정)
2. 각 질문 응답을 `responses` JSONB에 저장
3. 완료시 `total_score`, `result_id`, `completed_at` 업데이트
4. 트리거를 통해 `tests.completion_count` 자동 증가

---

## 뷰 활용

### tests_list 뷰 사용 예시

```sql
-- 관리자 테스트 목록 조회
SELECT * FROM tests_list
WHERE status = 'published'
ORDER BY created_at DESC;

-- 카테고리별 테스트 목록
SELECT * FROM tests_list
WHERE category_name = '성격/심리'
AND status = 'published';
```

### test_statistics 뷰 사용 예시

```sql
-- 인기 테스트 통계
SELECT * FROM test_statistics
WHERE completion_count > 100
ORDER BY completion_rate DESC;

-- 저조한 완료율 테스트 찾기
SELECT * FROM test_statistics
WHERE response_count > 50
AND completion_rate < 30;
```

---

## 보안 고려사항

1. **개인정보 보호**: IP 주소, User Agent 등은 익명화 정책 필요
2. **세션 관리**: session_id는 보안이 강화된 UUID 사용
3. **입력 검증**: JSONB 데이터는 스키마 검증 필수
4. **접근 제어**: RLS(Row Level Security) 적용 고려

---

## 백업 및 유지보수

1. **정기 백업**: 매일 전체 DB 백업, 시간별 WAL 백업
2. **데이터 정리**: 90일 이상 된 미완료 응답 정리
3. **통계 업데이트**: 매일 결과별 percentage 재계산
4. **모니터링**: 응답 테이블 용량 모니터링 및 파티셔닝 계획

---

## 변경 이력

### v1.1 (2025-09-15)

-   실제 데이터베이스 스키마 반영
-   tests_list, test_statistics 뷰 추가
-   필드 수 정확히 반영 (tests: 26개 → 20개)
-   categories 이미지 관련 필드 확인 반영
-   feedbacks에서 누락된 필드들 제거 반영

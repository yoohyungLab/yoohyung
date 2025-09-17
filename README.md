# 데이터베이스 스키마 정보

## 테이블 구조

### admin_users 테이블

| 필드명        | 타입                     | 제약조건 | 설명                 |
| ------------- | ------------------------ | -------- | -------------------- |
| id            | uuid                     | NOT NULL | 고유 식별자          |
| username      | character varying(50)    | NOT NULL | 관리자 로그인 아이디 |
| password_hash | character varying(255)   | NOT NULL | 암호화된 비밀번호    |
| email         | character varying(255)   | -        | 관리자 이메일        |
| name          | character varying(100)   | NOT NULL | 관리자 실명          |
| is_active     | boolean                  | -        | 계정 활성화 상태     |
| created_at    | timestamp with time zone | -        | 생성일시             |
| updated_at    | timestamp with time zone | -        | 수정일시             |

### categories 테이블

| 필드명        | 타입                     | 제약조건 | 설명              |
| ------------- | ------------------------ | -------- | ----------------- |
| id            | uuid                     | NOT NULL | 고유 식별자       |
| name          | character varying        | NOT NULL | 카테고리 명       |
| slug          | character varying        | NOT NULL | URL 슬러그        |
| description   | text                     | -        | 카테고리 설명     |
| sort_order    | integer                  | -        | 정렬 순서         |
| is_active     | boolean                  | -        | 활성화 상태       |
| created_at    | timestamp with time zone | NOT NULL | 생성일시          |
| updated_at    | timestamp with time zone | NOT NULL | 수정일시          |
| icon_url      | text                     | -        | 아이콘 이미지 URL |
| banner_url    | text                     | -        | 배너 이미지 URL   |
| thumbnail_url | text                     | -        | 썸네일 이미지 URL |

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

### profiles 테이블

| 필드명     | 타입                     | 제약조건 | 설명              |
| ---------- | ------------------------ | -------- | ----------------- |
| id         | uuid                     | NOT NULL | 고유 식별자       |
| email      | text                     | -        | 사용자 이메일     |
| name       | text                     | -        | 사용자 이름       |
| avatar_url | text                     | -        | 프로필 이미지 URL |
| provider   | text                     | -        | 인증 제공자       |
| created_at | timestamp with time zone | -        | 생성일시          |
| updated_at | timestamp with time zone | -        | 수정일시          |
| status     | character varying        | -        | 계정 상태         |

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

| 필드명               | 타입                        | 제약조건 | 설명                   |
| -------------------- | --------------------------- | -------- | ---------------------- |
| id                   | uuid                        | NOT NULL | 고유 식별자            |
| test_id              | uuid                        | -        | 테스트 참조            |
| result_name          | text                        | NOT NULL | 결과 이름              |
| result_order         | integer                     | NOT NULL | 결과 순서              |
| description          | text                        | -        | 결과 설명              |
| match_conditions     | jsonb                       | -        | 매칭 조건 (기본값: {}) |
| background_image_url | text                        | -        | 배경 이미지 URL        |
| theme_color          | character varying(7)        | -        | 테마 색상 (HEX)        |
| features             | jsonb                       | -        | 특징 (JSON)            |
| created_at           | timestamp without time zone | -        | 생성일시               |
| updated_at           | timestamp without time zone | -        | 수정일시               |

### tests 테이블

| 필드명         | 타입                     | 제약조건 | 설명                          |
| -------------- | ------------------------ | -------- | ----------------------------- |
| id             | uuid                     | NOT NULL | 고유 식별자                   |
| title          | character varying(255)   | NOT NULL | 테스트 제목                   |
| description    | text                     | -        | 테스트 설명                   |
| slug           | character varying(255)   | NOT NULL | URL 슬러그                    |
| thumbnail_url  | text                     | -        | 썸네일 이미지 URL             |
| response_count | integer                  | -        | 응답 수 (기본값: 0)           |
| view_count     | integer                  | -        | 조회 수 (기본값: 0)           |
| category_ids   | uuid[]                   | -        | 카테고리 ID 배열              |
| short_code     | character varying(10)    | -        | 짧은 코드                     |
| intro_text     | text                     | -        | 테스트 시작 문구              |
| status         | character varying(20)    | -        | 발행 상태 (draft/published)   |
| estimated_time | integer                  | -        | 예상 소요 시간 (분)           |
| scheduled_at   | timestamp with time zone | -        | 예약 발행 시간                |
| max_score      | integer                  | -        | 최대 점수 (심리 테스트용)     |
| type           | character varying(20)    | -        | 테스트 타입 (psychology/quiz) |
| published_at   | timestamp with time zone | -        | 발행일시                      |
| created_at     | timestamp with time zone | NOT NULL | 생성일시                      |
| updated_at     | timestamp with time zone | NOT NULL | 수정일시                      |

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

| 필드명                  | 타입                     | 제약조건 | 설명                  |
| ----------------------- | ------------------------ | -------- | --------------------- |
| id                      | uuid                     | NOT NULL | 고유 식별자           |
| test_id                 | uuid                     | -        | 테스트 참조           |
| user_id                 | uuid                     | -        | 사용자 ID (익명 가능) |
| session_id              | text                     | NOT NULL | 세션 추적 ID          |
| result_id               | uuid                     | -        | 결과 참조             |
| total_score             | integer                  | -        | 총 점수               |
| started_at              | timestamp with time zone | -        | 시작 시간             |
| completed_at            | timestamp with time zone | -        | 완료 시간             |
| completion_time_seconds | integer                  | -        | 완료 소요 시간 (초)   |
| ip_address              | inet                     | -        | IP 주소               |
| user_agent              | text                     | -        | 사용자 에이전트       |
| referrer                | text                     | -        | 리퍼러                |
| device_type             | character varying(20)    | -        | 디바이스 타입         |
| responses               | jsonb                    | NOT NULL | 실제 답변 데이터      |
| created_date            | date                     | -        | 생성 날짜             |
| created_at              | timestamp with time zone | -        | 생성일시              |

-- users 테이블에 provider 컬럼 추가
ALTER TABLE users 
ADD COLUMN provider VARCHAR(50) DEFAULT 'email';

-- provider 컬럼에 대한 인덱스 추가 (성능 최적화)
CREATE INDEX idx_users_provider ON users(provider);

-- 기존 데이터에 대해 provider 값을 'email'로 설정 (이미 DEFAULT 값이지만 명시적으로 설정)
UPDATE users 
SET provider = 'email' 
WHERE provider IS NULL;

-- provider 컬럼을 NOT NULL로 설정
ALTER TABLE users 
ALTER COLUMN provider SET NOT NULL;

-- provider 컬럼에 대한 체크 제약 조건 추가 (허용되는 값들)
ALTER TABLE users 
ADD CONSTRAINT check_provider_values 
CHECK (provider IN ('email', 'google', 'kakao', 'github', 'apple'));




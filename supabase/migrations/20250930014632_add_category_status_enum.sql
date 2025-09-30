-- Category status enum 타입 정의
CREATE TYPE category_status AS ENUM (
    'active',
    'inactive'
);

-- categories 테이블에 status 컬럼 추가
ALTER TABLE categories 
ADD COLUMN status category_status DEFAULT 'active';

-- 기존 is_active 데이터를 status로 마이그레이션
UPDATE categories 
SET status = CASE 
    WHEN is_active = true THEN 'active'::category_status
    WHEN is_active = false THEN 'inactive'::category_status
    ELSE 'inactive'::category_status
END;

-- status 컬럼을 NOT NULL로 설정
ALTER TABLE categories 
ALTER COLUMN status SET NOT NULL;

-- 기존 is_active 컬럼 제거
ALTER TABLE categories 
DROP COLUMN is_active;

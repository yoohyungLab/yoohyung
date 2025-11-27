-- ===================================
-- Admin Password Hash 재생성
-- $2a$ 형식의 해시를 PostgreSQL crypt()로 재생성
-- ===================================

-- 비밀번호를 PostgreSQL의 crypt() 함수로 재생성
-- 이렇게 하면 crypt() 함수로 검증 가능
UPDATE admin_users
SET password_hash = crypt('string12#', gen_salt('bf', 10))
WHERE email = 'admin@pickid.co.kr';

-- 확인: 해시가 제대로 생성되었는지 확인
SELECT 
  email,
  substring(password_hash, 1, 7) as hash_prefix,
  length(password_hash) as hash_length
FROM admin_users
WHERE email = 'admin@pickid.co.kr';


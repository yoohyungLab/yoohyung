-- ===================================
-- 기존 admin 함수 삭제
-- ===================================

-- 1. admin_login 함수 삭제
DROP FUNCTION IF EXISTS admin_login(text, text);

-- 2. admin_verify_session 함수 삭제
DROP FUNCTION IF EXISTS admin_verify_session(text);

-- 3. 확인 (함수가 삭제되었는지)
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name LIKE 'admin_%'
  AND routine_schema = 'public';

-- 결과가 없으면 모두 삭제된 것입니다.

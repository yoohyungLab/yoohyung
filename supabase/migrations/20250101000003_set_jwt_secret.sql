-- ===================================
-- JWT Secret 설정 (참고용)
-- ===================================

-- Legacy JWT Secret (사용 중):
-- fbbnK1KtURu5Y+7uKim9Yc1IiZxOd6oReyqnIfgml7VPrl+MMMS9tQNWKKjbyiq6/ZxnHUc+uiBK2iAm1+eQRw==

-- 참고:
-- - JWT Secret은 admin_login 함수 내에서 직접 하드코딩되어 있습니다
-- - ALTER DATABASE 명령은 권한이 필요하므로 사용하지 않습니다
-- - 이 값은 Supabase Dashboard → Settings → API → JWT Secret에서 확인할 수 있습니다
-- - 환경 변수 SUPABASE_JWT_SECRET에도 동일한 값이 저장되어 있습니다 (클라이언트 코드용)
-- - Key ID (e487d770-e6be-45d6-953a-ee7e1d888a44)가 아니라 실제 Secret 문자열이 필요합니다
--
-- JWT Secret을 변경하려면:
-- 1. supabase/migrations/20250101000001_simplify_admin_login.sql 파일에서
--    v_jwt_secret 변수 값을 수정
-- 2. Migration을 다시 실행


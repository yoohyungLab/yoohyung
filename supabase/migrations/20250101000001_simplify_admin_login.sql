-- ===================================
-- Admin Login RPC Function
-- 비밀번호 검증만 수행 (JWT는 Edge Function에서 생성)
-- ===================================

-- 1. pgcrypto extension 활성화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 기존 복잡한 함수들 삭제
DROP FUNCTION IF EXISTS admin_login(text, text);
DROP FUNCTION IF EXISTS admin_verify_session(text);
DROP FUNCTION IF EXISTS admin_get_current_user(text);

-- admin_login 함수 - 비밀번호 검증 후 사용자 정보만 반환
-- JWT 토큰은 Edge Function에서 생성 (Supabase 권장 방식)
CREATE OR REPLACE FUNCTION admin_login(
  p_email text,
  p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record admin_users;
  computed_hash text;
  hash_match boolean;
BEGIN
  -- 1. 이메일로 사용자 레코드 조회
  SELECT *
  INTO user_record
  FROM admin_users
  WHERE email = p_email AND is_active = true;

  -- 2. 사용자가 존재하지 않거나 비활성 상태인 경우
  IF user_record IS NULL THEN
    RAISE EXCEPTION 'Invalid login credentials';
  END IF;

  -- 3. 비밀번호 검증 (pgcrypto의 crypt 함수 사용)
  computed_hash := crypt(p_password, user_record.password_hash);
  hash_match := (user_record.password_hash = computed_hash);

  IF NOT hash_match THEN
    RAISE EXCEPTION 'Invalid login credentials';
  END IF;

  -- 4. 사용자 정보만 반환 (JWT는 Edge Function에서 생성)
  RETURN jsonb_build_object(
    'id', user_record.id,
    'email', user_record.email,
    'username', user_record.username,
    'name', user_record.name,
    'is_active', user_record.is_active
  );
END;
$$;

-- RPC 함수 권한 설정
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO authenticated;

-- ===================================
-- 참고: JWT 토큰 생성은 Edge Function에서 수행
-- ===================================
-- Edge Function (supabase/functions/admin-login/index.ts)에서:
-- 1. 이 RPC 함수를 호출하여 비밀번호 검증
-- 2. 검증 성공 시 jose 라이브러리로 JWT 토큰 생성
-- 3. Supabase JWT Secret은 Edge Function 환경 변수로 설정
--
-- 환경 변수 설정:
-- - SUPABASE_JWT_SECRET: Supabase Dashboard → Settings → API → JWT Secret
-- - SUPABASE_URL: Supabase 프로젝트 URL
-- - SUPABASE_SERVICE_ROLE_KEY: Service Role Key (RPC 호출용)


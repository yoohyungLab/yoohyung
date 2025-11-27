-- ===================================
-- Admin Auth with JWT (간단한 버전)
-- ===================================

-- 1. pgcrypto extension 활성화
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. pgjwt extension 설치 (JWT 생성/검증용)
-- Supabase에 기본 포함되어 있으므로 별도 설치 불필요

-- ===================================
-- admin_login: JWT 토큰 생성
-- ===================================

-- 기존 함수 삭제 (반환 타입 변경을 위해)
DROP FUNCTION IF EXISTS admin_login(text, text);

CREATE OR REPLACE FUNCTION admin_login(
  p_email text,
  p_password text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user admin_users;
  v_password_match boolean;
  v_jwt_secret text;
  v_jwt_token text;
  v_exp_timestamp integer;
BEGIN
  -- 1. 사용자 조회
  SELECT *
  INTO v_user
  FROM admin_users
  WHERE email = p_email AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid login credentials';
  END IF;

  -- 2. 비밀번호 검증
  v_password_match := (v_user.password_hash = crypt(p_password, v_user.password_hash));

  IF NOT v_password_match THEN
    RAISE EXCEPTION 'Invalid login credentials';
  END IF;

  -- 3. JWT 토큰 생성 (7일 유효)
  v_exp_timestamp := extract(epoch from now() + interval '7 days')::integer;

  -- Supabase의 sign 함수로 JWT 생성
  v_jwt_token := sign(
    json_build_object(
      'sub', v_user.id,
      'email', v_user.email,
      'role', 'admin',
      'exp', v_exp_timestamp,
      'iat', extract(epoch from now())::integer
    ),
    current_setting('app.jwt_secret', true)
  );

  -- 4. 성공 응답 (토큰 + 사용자 정보)
  RETURN jsonb_build_object(
    'token', v_jwt_token,
    'user', jsonb_build_object(
      'id', v_user.id,
      'email', v_user.email,
      'username', v_user.username,
      'name', v_user.name,
      'is_active', v_user.is_active
    )
  );
END;
$$;

-- ===================================
-- admin_verify_session: JWT 토큰 검증
-- ===================================

-- 기존 함수 삭제 (존재하는 경우)
DROP FUNCTION IF EXISTS admin_verify_session(text);

CREATE OR REPLACE FUNCTION admin_verify_session(
  p_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_payload jsonb;
  v_user admin_users;
BEGIN
  -- 1. JWT 토큰 검증 및 디코딩
  BEGIN
    v_payload := verify(
      p_token,
      current_setting('app.jwt_secret', true),
      'HS256'
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Invalid or expired token';
  END;

  -- 2. 사용자 조회
  SELECT *
  INTO v_user
  FROM admin_users
  WHERE id = (v_payload->>'sub')::uuid
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Admin user not found or inactive';
  END IF;

  -- 3. 사용자 정보 반환
  RETURN jsonb_build_object(
    'id', v_user.id,
    'email', v_user.email,
    'username', v_user.username,
    'name', v_user.name,
    'is_active', v_user.is_active
  );
END;
$$;

-- ===================================
-- 권한 설정
-- ===================================
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION admin_verify_session(text) TO anon;
GRANT EXECUTE ON FUNCTION admin_verify_session(text) TO authenticated;

-- ===================================
-- JWT Secret 설정 (중요!)
-- ===================================
-- Supabase Dashboard → Settings → API → JWT Secret 값 사용
-- 또는 아래 명령어로 설정:
-- ALTER DATABASE postgres SET app.jwt_secret = 'your-jwt-secret-key-here';

-- ===================================
-- 테스트
-- ===================================

-- 1. 비밀번호 설정 (테스트용)
UPDATE admin_users
SET password_hash = crypt('string12#', gen_salt('bf'))
WHERE email = 'admin@pickid.co.kr';

-- 2. 로그인 테스트
SELECT admin_login('admin@pickid.co.kr', 'string12#');

-- 3. 토큰 검증 테스트 (위에서 받은 토큰으로)
-- SELECT admin_verify_session('eyJ...');

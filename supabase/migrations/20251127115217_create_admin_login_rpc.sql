-- ===================================
-- Admin Login RPC Function Migration
-- admin_users 테이블 기반 로그인 (pgcrypto 사용)
-- ===================================

-- pgcrypto extension 활성화 (bcrypt 해시 검증용)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- admin_login RPC 함수
-- SETOF admin_users를 반환하여 클라이언트에서 배열로 받을 수 있도록 함
CREATE OR REPLACE FUNCTION admin_login(
  p_email text,
  p_password text
)
RETURNS SETOF admin_users
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record admin_users;
BEGIN
  -- 1. 이메일로 사용자 레코드 조회
  SELECT *
  INTO user_record
  FROM admin_users
  WHERE email = p_email;

  -- 2. 사용자가 존재하지 않거나 비활성 상태인 경우
  IF user_record IS NULL OR user_record.is_active = FALSE THEN
    RETURN; -- 아무것도 반환하지 않음 (로그인 실패)
  END IF;

  -- 3. 비밀번호 검증 (pgcrypto의 crypt 함수 사용)
  -- crypt(평문 비밀번호, 저장된 해시) 결과가 저장된 해시와 같으면 인증 성공
  IF user_record.password_hash = crypt(p_password, user_record.password_hash) THEN
    RETURN NEXT user_record; -- 사용자 정보 반환 (로그인 성공)
  ELSE
    RETURN; -- 아무것도 반환하지 않음 (로그인 실패)
  END IF;
END;
$$;

-- RPC 함수 권한 설정 (anon과 authenticated 사용자가 호출 가능)
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO anon;
GRANT EXECUTE ON FUNCTION admin_login(text, text) TO authenticated;


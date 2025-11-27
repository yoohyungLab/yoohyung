-- ===================================
-- pgjwt Extension 활성화
-- ===================================
-- Supabase에서 pgjwt extension을 활성화합니다.
-- 이 extension은 JWT 토큰 생성 및 검증에 사용됩니다.

-- pgjwt extension 활성화
CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;

-- 참고:
-- - Supabase Dashboard → Database → Extensions에서도 활성화할 수 있습니다
-- - pgjwt extension이 활성화되지 않으면 admin_login 함수에서 sign() 함수를 사용할 수 없습니다
-- - 만약 extension 활성화에 실패하면, Supabase Dashboard에서 수동으로 활성화하세요


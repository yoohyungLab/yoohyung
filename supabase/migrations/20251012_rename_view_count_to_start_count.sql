-- Migration: Rename view_count to start_count
-- Description: 
--   - 기존 view_count 컬럼을 start_count로 변경
--   - "시작하기" 버튼 클릭 시 증가하는 의미로 명확화
--   - 비용 절감 (페이지 진입 시마다 RPC 호출 방지)

-- Step 1: 컬럼명 변경
ALTER TABLE tests 
RENAME COLUMN view_count TO start_count;

-- Step 2: 기존 RPC 함수 삭제 (존재하는 경우)
DROP FUNCTION IF EXISTS increment_test_view(uuid);

-- Step 3: 새로운 RPC 함수 생성
CREATE OR REPLACE FUNCTION increment_test_start(test_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE tests
  SET start_count = COALESCE(start_count, 0) + 1,
      updated_at = NOW()
  WHERE id = test_uuid;
END;
$$;

-- Step 4: 함수 권한 설정
GRANT EXECUTE ON FUNCTION increment_test_start(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_test_start(uuid) TO authenticated;

-- Step 5: 코멘트 추가
COMMENT ON COLUMN tests.start_count IS '시작 횟수 ("시작하기" 버튼 클릭 시 증가)';
COMMENT ON FUNCTION increment_test_start IS '"시작하기" 버튼 클릭 시 start_count 증가';


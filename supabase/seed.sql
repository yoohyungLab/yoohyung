-- 기본 카테고리 데이터 삽입
INSERT INTO categories (id, name, slug, description, sort_order, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', '성격 테스트', 'personality', 'MBTI, 성격 유형 등 성격 관련 테스트', 1, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', '연애 테스트', 'relationship', '연애 스타일, 이상형 등 연애 관련 테스트', 2, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', '취미 테스트', 'hobby', '취미, 관심사 등 개인 취향 관련 테스트', 3, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', '심리 테스트', 'psychology', '심리 상태, 감정 등 심리 관련 테스트', 4, 'active', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', '기타 테스트', 'etc', '기타 다양한 주제의 테스트', 5, 'active', NOW(), NOW());

-- 기본 테스트 데이터 삽입 (카테고리와 연결)
INSERT INTO tests (id, title, description, slug, thumbnail_url, category_ids, status, estimated_time, created_at, updated_at, published_at) VALUES
('test-001', 'MBTI 성격 유형 테스트', '당신의 MBTI 성격 유형을 알아보세요', 'mbti-test', '/images/egen-teto/thumbnail.png', ARRAY['550e8400-e29b-41d4-a716-446655440001'], 'published', 5, NOW(), NOW(), NOW()),
('test-002', '연애 스타일 테스트', '당신의 연애 스타일을 분석해보세요', 'love-style-test', '/images/egen-teto/thumbnail.png', ARRAY['550e8400-e29b-41d4-a716-446655440002'], 'published', 3, NOW(), NOW(), NOW());


// ============================================
// constants/test.ts
// 테스트 관련 모든 설정
// ============================================

// 테스트 상태
export const TEST_STATUSES = {
	draft: { value: 'draft', label: '초안', variant: 'outline' as const },
	published: { value: 'published', label: '게시됨', variant: 'success' as const },
	scheduled: { value: 'scheduled', label: '예약됨', variant: 'info' as const },
	archived: { value: 'archived', label: '보관됨', variant: 'destructive' as const },
} as const;

export type TestStatus = keyof typeof TEST_STATUSES;

// 테스트 타입
export const TEST_TYPES = {
	psychology: {
		value: 'psychology',
		name: '심리형',
		description: 'MBTI, 색상/동물 등 성향 분석',
		features: ['점수 매핑', '성향 분석', '다차원 결과'],
		examples: ['MBTI 테스트', '성격 유형 테스트', '색깔 심리 테스트'],
	},
	balance: {
		value: 'balance',
		name: '밸런스형',
		description: '2지선다/다지선다 선택',
		features: ['선택 비율', '통계 기반', '간단한 선택'],
		examples: ['이상형 월드컵', '음식 vs 음식', '취향 밸런스 게임'],
	},
	character: {
		value: 'character',
		name: '캐릭터 매칭형',
		description: '특정 IP/캐릭터와 매칭',
		features: ['캐릭터 매칭', '이미지 중심', '팬덤 콘텐츠'],
		examples: ['포켓몬 찾기', '디즈니 프린세스', '동물상 테스트'],
	},
	quiz: {
		value: 'quiz',
		name: '퀴즈형',
		description: '지식/정답 기반',
		features: ['정답 체크', '점수 계산', '지식 테스트'],
		examples: ['상식 퀴즈', '전문 지식 테스트', 'IQ 테스트'],
	},
	meme: {
		value: 'meme',
		name: '밈형',
		description: '밈/이모지 매칭',
		features: ['랜덤 결과', '재미 중심', '바이럴 콘텐츠'],
		examples: ['짤방 테스트', '밈 성향', '인터넷 밈 매칭'],
	},
	lifestyle: {
		value: 'lifestyle',
		name: '라이프스타일형',
		description: '취향 기반',
		features: ['취향 분석', '라이프스타일', '추천 시스템'],
		examples: ['여행 스타일', '음식 취향', '패션 스타일'],
	},
} as const;

export type TestType = keyof typeof TEST_TYPES;

// 테스트 생성 단계
export const TEST_CREATION_STEPS = [
	{ id: 1, title: '유형 선택', description: '테스트 유형을 선택하세요' },
	{ id: 2, title: '기본 정보', description: '테스트의 기본 정보를 입력하세요' },
	{ id: 3, title: '질문 작성', description: '테스트 질문을 작성하세요' },
	{ id: 4, title: '결과 설정', description: '테스트 결과를 정의하세요' },
	{ id: 5, title: '미리보기', description: '테스트를 확인하고 발행하세요' },
] as const;

// 테스트 기본값 (Form 초기화용)
export const DEFAULT_TEST = {
	title: '',
	description: '',
	slug: '',
	thumbnail_url: '',
	category_ids: [],
	short_code: '',
	intro_text: '',
	status: 'published' as TestStatus,
	estimated_time: 5,
	scheduled_at: null,
	max_score: 100,
	type: 'psychology' as TestType,
	published_at: null,
	requires_gender: false,
	features: {
		scoring: {
			mode: 'score_range' as const,
			max_score: 100,
			base_types: [],
		},
	},
} as const;

export const DEFAULT_QUESTION = {
	question_text: '',
	question_order: 0,
	image_url: null,
	question_type: 'multiple_choice' as const,
	correct_answers: null,
	explanation: null,
	choices: [
		{ choice_text: '', choice_order: 0, score: null, is_correct: false, code: null },
		{ choice_text: '', choice_order: 1, score: null, is_correct: false, code: null },
	],
} as const;

export const DEFAULT_RESULT = {
	result_name: '',
	result_order: 0,
	description: null,
	match_conditions: { type: 'score' as const, min: 0, max: 30 },
	background_image_url: null,
	theme_color: '#3B82F6',
	features: {},
	target_gender: null,
} as const;

// 레거시 호환성 (기존 코드에서 사용 중)
export const DEFAULT_BASIC_INFO = DEFAULT_TEST;
export const DEFAULT_CHOICE = {
	choice_text: '',
	choice_order: 0,
	score: null,
	is_correct: false,
	code: null,
	last_updated: null,
	response_count: null,
};

// 레거시 호환성 (기존 코드에서 사용 중)
export const TEST_STATUS = {
	PUBLISHED: 'published',
	DRAFT: 'draft',
	SCHEDULED: 'scheduled',
	ARCHIVED: 'archived',
} as const;

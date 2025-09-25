// 테스트 유형 정의
export const testTypes: any[] = [
	{
		id: 'psychology',
		name: '심리형',
		description: 'MBTI, 색상/동물 등 성향 분석',
		icon: 'Brain',
		color: 'blue',
		features: ['점수 매핑', '성향 분석', '다차원 결과'],
		examples: ['MBTI 테스트', '성격 유형 테스트', '색깔 심리 테스트'],
	},
	{
		id: 'balance',
		name: '밸런스형',
		description: '2지선다/다지선다 선택',
		icon: 'Users',
		color: 'green',
		features: ['선택 비율', '통계 기반', '간단한 선택'],
		examples: ['이상형 월드컵', '음식 vs 음식', '취향 밸런스 게임'],
	},
	{
		id: 'character',
		name: '캐릭터 매칭형',
		description: '특정 IP/캐릭터와 매칭',
		icon: 'Heart',
		color: 'pink',
		features: ['캐릭터 매칭', '이미지 중심', '팬덤 콘텐츠'],
		examples: ['포켓몬 찾기', '디즈니 프린세스', '동물상 테스트'],
	},
	{
		id: 'quiz',
		name: '퀴즈형',
		description: '지식/정답 기반',
		icon: 'Brain',
		color: 'purple',
		features: ['정답 체크', '점수 계산', '지식 테스트'],
		examples: ['상식 퀴즈', '전문 지식 테스트', 'IQ 테스트'],
	},
	{
		id: 'meme',
		name: '밈형',
		description: '밈/이모지 매칭',
		icon: 'Zap',
		color: 'yellow',
		features: ['랜덤 결과', '재미 중심', '바이럴 콘텐츠'],
		examples: ['짤방 테스트', '밈 성향', '인터넷 밈 매칭'],
	},
	{
		id: 'lifestyle',
		name: '라이프스타일형',
		description: '취향 기반',
		icon: 'Coffee',
		color: 'orange',
		features: ['취향 분석', '라이프스타일', '추천 시스템'],
		examples: ['여행 스타일', '음식 취향', '패션 스타일'],
	},
];

// 카테고리 정의
export const categories = [
	{ id: 1, name: 'personality', display_name: '성격/심리' },
	{ id: 2, name: 'love', display_name: '연애/관계' },
	{ id: 3, name: 'career', display_name: '직업/진로' },
	{ id: 4, name: 'lifestyle', display_name: '라이프스타일' },
	{ id: 5, name: 'entertainment', display_name: '엔터테인먼트' },
	{ id: 6, name: 'knowledge', display_name: '지식/상식' },
	{ id: 7, name: 'fun', display_name: '재미/밈' },
	{ id: 8, name: 'culture', display_name: '문화/트렌드' },
];

// 단계 정의
export const steps = [
	{ id: 1, title: '유형 선택', description: '테스트 유형을 선택하세요' },
	{ id: 2, title: '기본 정보', description: '테스트의 기본 정보를 입력하세요' },
	{ id: 3, title: '질문 작성', description: '테스트 질문을 작성하세요' },
	{ id: 4, title: '결과 설정', description: '테스트 결과를 정의하세요' },
	{ id: 5, title: '미리보기', description: '테스트를 확인하고 발행하세요' },
];

// 기본 테스트 데이터
export const defaultTestData = {
	title: '',
	description: '',
	intro_text: '',
	category_ids: [] as number[],
	slug: '',
	thumbnail_url: '',
	estimated_time: 5,
	status: 'draft' as any,
	scheduled_at: null as string | null,
	max_score: 100,
};

// 기본 질문 데이터
export const defaultQuestion = {
	id: 1,
	text: '',
	image_url: '',
	group: '',
	choices: [
		{ text: '', image_url: '', score: 1, correct: false, result_id: null },
		{ text: '', image_url: '', score: 2, correct: false, result_id: null },
	],
};

// 기본 결과 데이터
export const defaultResult = {
	id: 1,
	name: '',
	description: '',
	features: [] as string[],
	match_results: [] as number[],
	jobs: [] as string[],
	bg_image_url: '',
	theme_color: '#3B82F6',
	condition: { type: 'score', min: 0, max: 30 },
};

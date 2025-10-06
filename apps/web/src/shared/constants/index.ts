// ============================================================================
// 통합 상수 파일 - 픽키드
// ============================================================================

// ============================================================================
// 테스트 관련 상수
// ============================================================================

// 테스트 카테고리
export const TEST_CATEGORIES = {
	1: '성격',
	2: '연애/인간관계',
	3: '감정/멘탈',
	4: '밸런스 게임',
	5: '사고/결정 방식',
	6: '지능/능력',
	7: '라이프스타일',
	8: 'MBTI 응용',
	9: '기타',
} as const;

export type CategoryId = keyof typeof TEST_CATEGORIES;

// ============================================================================
// 에겐·테토 테스트 상수
// ============================================================================

// Supabase에서 가져온 타입 사용

// 에겐·테토용 질문 타입 (Supabase 타입을 확장)
interface EgenTetoQuestion {
	id: number; // 에겐·테토는 숫자 ID 사용
	question_text: string; // Supabase 타입과 일치
	question_order: number; // Supabase 타입과 일치
	image_url: string | null; // Supabase 타입과 일치
	choices: {
		text: string;
		score: number;
		type: string;
	}[];
}

// 에겐·테토 질문
export const EGEN_TETO_QUESTIONS: EgenTetoQuestion[] = [
	{
		id: 1,
		question_text: '카톡으로 친구가 "오늘 진짜 최악이야 ㅠㅠ"라고 보냈을 때?',
		question_order: 1,
		image_url: null,
		choices: [
			{
				text: '어머 무슨 일이야? 😰 진짜 힘들었겠다... 괜찮아?',
				score: 2,
				type: '에겐 강',
			},
			{
				text: '헉 뭔 일? 이야기해줘 나도 같이 속상해할게 ㅠ',
				score: 1,
				type: '에겐 약',
			},
			{ text: '뭔 일인데? 상황 정리해서 말해봐', score: -1, type: '테토 약' },
			{ text: '그래서? 어쩔 건데?', score: -2, type: '테토 강' },
		],
	},
	{
		id: 2,
		question_text: '단톡방에서 모임 장소 정할 때 나는?',
		question_order: 2,
		image_url: null,
		choices: [
			{
				text: '다들 어디가 좋을까요~? 의견 들어보고 싶어요!',
				score: 2,
				type: '에겐 강',
			},
			{ text: '아무데나 좋아요~ 다들 편한 곳으로!', score: 1, type: '에겐 약' },
			{ text: '홍대 어때? 지하철역 근처로 잡자', score: -1, type: '테토 약' },
			{ text: '강남역 2번 출구 6시. 늦으면 버려', score: -2, type: '테토 강' },
		],
	},
	{
		id: 3,
		question_text: '넷플릭스 뭐 볼지 고를 때?',
		question_order: 3,
		image_url: null,
		choices: [
			{
				text: '같이 보고 싶은 거 있어? 취향 맞춰볼까?',
				score: 2,
				type: '에겐 강',
			},
			{
				text: '로맨스나 힐링 드라마 어때? 무거운 건 별로...',
				score: 1,
				type: '에겐 약',
			},
			{
				text: '평점 높은 거 추천해줄까? 장르별로 정리해뒀어',
				score: -1,
				type: '테토 약',
			},
			{ text: '시간 아까우니까 그냥 이거 봐', score: -2, type: '테토 강' },
		],
	},
	{
		id: 4,
		question_text: '새로 만난 사람과 어색할 때?',
		question_order: 4,
		image_url: null,
		choices: [
			{ text: '혹시 불편하지 않을까? 계속 눈치 봄', score: 2, type: '에겐 강' },
			{
				text: '상대반응 살피며 조심스럽게 대화 시도',
				score: 1,
				type: '에겐 약',
			},
			{
				text: '어디 살아요? 뭐 하세요? 적당한 질문으로 분위기 풀기',
				score: -1,
				type: '테토 약',
			},
			{ text: '어색하네요. 그냥 편하게 해요', score: -2, type: '테토 강' },
		],
	},
	{
		id: 5,
		question_text: '친구가 내 충고를 안 들을 때?',
		question_order: 5,
		image_url: null,
		choices: [
			{ text: '내가 잘못 말한 건 아닐까? 자책함', score: 2, type: '에겐 강' },
			{ text: '음... 내 말이 도움이 안 됐나봐', score: 1, type: '에겐 약' },
			{ text: '뭐 본인이 결정할 일이지', score: -1, type: '테토 약' },
			{ text: '그럼 나중에 후회해도 모른다?', score: -2, type: '테토 강' },
		],
	},
	{
		id: 6,
		question_text: '데이트 코스 정할 때?',
		question_order: 6,
		image_url: null,
		choices: [
			{
				text: '너 가고 싶은 데 있어? 네가 좋아할 만한 곳 찾아볼게!',
				score: 2,
				type: '에겐 강',
			},
			{
				text: '카페나 공원에서 산책하면서 이야기하자',
				score: 1,
				type: '에겐 약',
			},
			{
				text: '날씨 보고 실내/실외 나눠서 정하자. 맛집 반영',
				score: -1,
				type: '테토 약',
			},
			{
				text: '내가 아는 좋은 데 있어. 거기로 가자',
				score: -2,
				type: '테토 강',
			},
		],
	},
	{
		id: 7,
		question_text: '팀 프로젝트에서 의견이 안 맞을 때?',
		question_order: 7,
		image_url: null,
		choices: [
			{
				text: '우리 다시 한번 차근차근 얘기해볼까요?',
				score: 2,
				type: '에겐 강',
			},
			{ text: '..."네 알겠습니다" (속으로는 답답)', score: 1, type: '에겐 약' },
			{ text: '각자 장단점 정리해서 비교해보죠', score: -1, type: '테토 약' },
			{ text: '시간 없으니까 다수결로 결정하자', score: -2, type: '테토 강' },
		],
	},
	{
		id: 8,
		question_text: 'SNS에 올릴 사진 고를 때?',
		question_order: 8,
		image_url: null,
		choices: [
			{ text: '친구들과 찍은 사진, 일상 공유 위주', score: 2, type: '에겐 강' },
			{ text: '예쁘게 나온 셀카, 음식 사진', score: 1, type: '에겐 약' },
			{ text: '여행, 운동 인증샷처럼 활동 중심', score: -1, type: '테토 약' },
			{ text: 'SNS 뭐가 좋다고 하는 거임?', score: -2, type: '테토 강' },
		],
	},
	{
		id: 9,
		question_text: '스트레스 받을 때 해소 방법?',
		question_order: 9,
		image_url: null,
		choices: [
			{ text: '친구들과 수다 떨며 공감받기', score: 2, type: '에겐 강' },
			{
				text: '혼자 조용히 드라마 보거나 음악 듣기',
				score: 1,
				type: '에겐 약',
			},
			{ text: '운동이나 취미에 몰입', score: -1, type: '테토 약' },
			{
				text: '스트레스가 뭔 스트레스야. 그냥 잊어버려',
				score: -2,
				type: '테토 강',
			},
		],
	},
	{
		id: 10,
		question_text: '새로운 도전 앞에서?',
		question_order: 10,
		image_url: null,
		choices: [
			{
				text: '주변 사람들이 어떻게 생각할까? 타인 반응 우선',
				score: 2,
				type: '에겐 강',
			},
			{
				text: '실패하면 어떡하지… 불안하지만 천천히 준비',
				score: 1,
				type: '에겐 약',
			},
			{ text: '계획 세우고 차근차근 도전해보자', score: -1, type: '테토 약' },
			{
				text: '일단 해보고 안 되면 그때 생각하지 뭐',
				score: -2,
				type: '테토 강',
			},
		],
	},
];

// 에겐·테토 결과 데이터
interface ResultData {
	title: string;
	description: string;
	characteristics: string[];
	emoji: string;
}

export const EGEN_TETO_RESULTS: Record<string, ResultData> = {
	'egen-male': {
		title: '에겐남',
		description: '감성 디렉터형\n친구들 사이에서 마음 읽기의 달인으로 통하는 섬세한 타입!',
		characteristics: [
			'친구 상담사 역할을 자주 맡음',
			'기념일, 선물 등 세심하게 챙김',
			'"너 오늘 뭔가 안 좋아 보이는데?" 라는 말을 자주 함',
			'로맨스나 감동 콘텐츠를 즐김',
			'갈등 상황에서 중재자 역할',
		],
		emoji: '🤝',
	},
	'egen-female': {
		title: '에겐녀',
		description: '힐링 에너지형\n당신 주변에만 있어도 마음이 따뜻해지는 감성 힐러 타입입니다.',
		characteristics: [
			'"괜찮아, 다 잘 될 거야" 를 잘 말해줌',
			'인스타에 감성 일상 사진 자주 올림',
			'작은 호의에도 크게 감동함',
			'동물/아기만 봐도 심쿵',
			'친구들의 비밀 저장소 역할',
		],
		emoji: '💕',
	},
	'teto-male': {
		title: '테토남',
		description: '액션 리더형\n말보다 행동이 먼저이고, 현실적인 해결책을 찾는 추진력 있는 타입!',
		characteristics: [
			'단톡방에서 단답/직설 스타일',
			'고민 상담 시 현실적인 조언 위주',
			'운동, 게임 등 승부욕 강함',
			'"왜 그렇게 복잡하게 생각해?" 라는 말을 자주 함',
			'책임감과 리더십이 강함',
		],
		emoji: '💪',
	},
	'teto-female': {
		title: '테토녀',
		description: '걸크러쉬형\n당당하고 자신감 넘치는 카리스마 있는 스타일. "언니 멋있어요" 소리 자주 듣는 타입!',
		characteristics: [
			'"할 수 있다/없다" 명확히 판단함',
			'새로운 도전 좋아함',
			'편한 옷 선호, 꾸밈보다 효율 우선',
			'인맥 넓고 남사친도 많은 편',
			'목표 생기면 끝까지 밀고 나감',
		],
		emoji: '🔥',
	},
	mixed: {
		title: '혼합형',
		description: '올라운드 플레이어형\n감성과 이성을 상황에 맞춰 조합할 수 있는 만능 밸런스형!',
		characteristics: [
			'사람 대할 땐 따뜻하고 일할 땐 냉철함',
			'다양한 그룹에서도 자연스럽게 스며듦',
			'상황 판단력이 뛰어남',
			'감정과 논리의 균형이 좋음',
			'다양한 사람들과 좋은 관계 유지',
		],
		emoji: '⚖️',
	},
};

// 에겐·테토 결과 배경 이미지
export const EGEN_TETO_RESULT_BG_IMAGES: Record<string, string> = {
	'egen-male': '/images/egen-teto/bg-egen-male.png',
	'egen-female': '/images/egen-teto/bg-egen-female.png',
	'teto-male': '/images/egen-teto/bg-teto-male.png',
	'teto-female': '/images/egen-teto/bg-egen-female.png',
	mixed: '/images/egen-teto/bg-mixed.jpg',
};


// ============================================================================
// 피드백 관련 상수
// ============================================================================

// 피드백 카테고리
export const FEEDBACK_CATEGORIES = [
	{
		name: 'test_idea',
		label: '테스트 아이디어',
		emoji: '💡',
		description: '새로운 심리테스트 제안',
	},
	{
		name: 'feature',
		label: '기능 개선',
		emoji: '⚡',
		description: '기존 기능 개선 제안',
	},
	{
		name: 'bug_report',
		label: '오류 신고',
		emoji: '🐛',
		description: '발견된 버그나 문제점',
	},
	{
		name: 'design',
		label: '디자인',
		emoji: '🎨',
		description: 'UI/UX 개선 제안',
	},
	{
		name: 'mobile',
		label: '모바일',
		emoji: '📱',
		description: '모바일 환경 개선',
	},
	{
		name: 'other',
		label: '기타',
		emoji: '💭',
		description: '기타 의견 및 제안',
	},
] as const;

// 피드백 상태
export const FEEDBACK_STATUS = {
	pending: {
		label: '💡 검토중',
		color: 'bg-yellow-100 text-yellow-700',
		value: 'pending',
	},
	in_progress: {
		label: '⚡ 진행중',
		color: 'bg-blue-100 text-blue-700',
		value: 'in_progress',
	},
	completed: {
		label: '✅ 채택됨',
		color: 'bg-green-100 text-green-700',
		value: 'completed',
	},
	replied: {
		label: '📝 답변완료',
		color: 'bg-purple-100 text-purple-700',
		value: 'replied',
	},
	rejected: {
		label: '❌ 반려',
		color: 'bg-red-100 text-red-700',
		value: 'rejected',
	},
} as const;

// 테스트 생성 관련 유틸리티 함수들

// Slug 생성 함수
export const generateSlug = (title: string): string => {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9가-힣]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
};

// 유형별 질문 템플릿 생성
export const generateQuestionTemplate = (type: any): any[] => {
	const templates: any = {
		psychology: [
			{
				text: '사람들과의 모임에서 나는?',
				choices: [
					{ text: '사람들과 대화하며 에너지를 얻는다', score: 5 },
					{ text: '조용히 관찰하며 시간을 보낸다', score: 1 },
				],
			},
			{
				text: '새로운 계획을 세울 때 나는?',
				choices: [
					{ text: '체계적으로 단계별로 계획한다', score: 5 },
					{ text: '대략적인 방향만 정하고 융통성 있게 진행한다', score: 1 },
				],
			},
		],
		balance: [
			{
				text: '치킨 vs 피자, 당신의 선택은?',
				choices: [
					{ text: '치킨 🍗', score: 1 },
					{ text: '피자 🍕', score: 2 },
				],
			},
			{
				text: '여행 vs 집콕, 어떤 휴가를 선호하나요?',
				choices: [
					{ text: '새로운 곳으로 여행 ✈️', score: 1 },
					{ text: '집에서 편안한 휴식 🏠', score: 2 },
				],
			},
		],
		character: [
			{
				text: '가장 끌리는 색깔은?',
				choices: [
					{ text: '빨간색 - 열정적이고 역동적', score: 1, result_id: 1 },
					{ text: '파란색 - 차분하고 신뢰감 있는', score: 2, result_id: 2 },
					{ text: '노란색 - 밝고 활기찬', score: 3, result_id: 3 },
				],
			},
			{
				text: '선호하는 활동은?',
				choices: [
					{ text: '모험적인 야외 활동', score: 1, result_id: 1 },
					{ text: '조용한 독서나 영화감상', score: 2, result_id: 2 },
					{ text: '친구들과의 즐거운 파티', score: 3, result_id: 3 },
				],
			},
		],
		quiz: [
			{
				text: '대한민국의 수도는?',
				choices: [
					{ text: '서울', score: 10, correct: true },
					{ text: '부산', score: 0, correct: false },
					{ text: '대구', score: 0, correct: false },
					{ text: '인천', score: 0, correct: false },
				],
			},
			{
				text: '지구에서 가장 큰 대륙은?',
				choices: [
					{ text: '아시아', score: 10, correct: true },
					{ text: '아프리카', score: 0, correct: false },
					{ text: '북아메리카', score: 0, correct: false },
					{ text: '유럽', score: 0, correct: false },
				],
			},
		],
		meme: [
			{
				text: '월요일 아침 기분을 표현한다면?',
				choices: [
					{ text: '😭 (현실 부정)', score: 1 },
					{ text: '😤 (의욕 충만)', score: 2 },
					{ text: '😴 (5분만 더...)', score: 3 },
				],
			},
			{
				text: '친구가 갑자기 연락 없이 집에 왔다면?',
				choices: [
					{ text: '🏃‍♂️ (도망)', score: 1 },
					{ text: '🤗 (환영)', score: 2 },
					{ text: '😒 (당황)', score: 3 },
				],
			},
		],
		lifestyle: [
			{
				text: '이상적인 주말 오후는?',
				choices: [
					{ text: '카페에서 여유로운 독서', score: 1 },
					{ text: '친구들과 쇼핑몰 탐방', score: 2 },
					{ text: '집에서 넷플릭스 시청', score: 3 },
				],
			},
			{
				text: '패션 스타일 선호도는?',
				choices: [
					{ text: '심플하고 깔끔한 미니멀', score: 1 },
					{ text: '개성 있고 독특한 스타일', score: 2 },
					{ text: '편안하고 캐주얼한 룩', score: 3 },
				],
			},
		],
	};

	const template = templates[type] || templates.psychology;
	return template.map((q: any, index: number) => ({
		id: index + 1,
		text: q.text,
		image_url: '',
		group: '',
		choices: q.choices.map((c: any) => ({
			text: c.text,
			image_url: '',
			score: c.score || 1,
			correct: c.correct || false,
			result_id: c.result_id || null,
		})),
	}));
};

// 유형별 결과 템플릿 생성
export const generateResultTemplate = (type: any): any[] => {
	const templates: any = {
		psychology: [
			{
				name: '외향적 리더형',
				description: '사람들과의 소통을 즐기고 자연스럽게 리더십을 발휘하는 타입입니다.',
				theme_color: '#EF4444',
			},
			{
				name: '내향적 사색형',
				description: '혼자만의 시간을 소중히 여기며 깊이 있는 사고를 좋아하는 타입입니다.',
				theme_color: '#3B82F6',
			},
			{
				name: '균형잡힌 조화형',
				description: '상황에 따라 유연하게 대처하며 균형감각이 뛰어난 타입입니다.',
				theme_color: '#10B981',
			},
		],
		character: [
			{
				name: '🔥 열정의 레드',
				description: '에너지가 넘치고 도전을 즐기는 당신! 모든 일에 열정적으로 임합니다.',
				theme_color: '#DC2626',
			},
			{
				name: '💙 신뢰의 블루',
				description: '차분하고 믿음직한 당신! 사람들에게 안정감을 주는 존재입니다.',
				theme_color: '#2563EB',
			},
			{
				name: '⭐ 활기의 옐로',
				description: '밝고 긍정적인 당신! 주변을 환하게 만드는 에너지를 가지고 있습니다.',
				theme_color: '#EAB308',
			},
		],
		quiz: [
			{
				name: '지식왕 👑',
				description: '놀라운 지식의 소유자! 다양한 분야에 해박한 지식을 가지고 있습니다.',
				theme_color: '#7C3AED',
			},
			{
				name: '상식인 📚',
				description: '기본적인 상식을 잘 알고 있는 평범하지만 똑똑한 당신!',
				theme_color: '#059669',
			},
			{
				name: '호기심 많은 초보자 🌱',
				description: '아직 배울 것이 많지만 호기심이 가득한 당신! 계속 성장해나가세요.',
				theme_color: '#0891B2',
			},
		],
	};

	const template = templates[type] || templates.psychology;
	return template.map((r: any, index: number) => ({
		id: index + 1,
		name: r.name,
		description: r.description,
		features: [],
		match_results: [],
		jobs: [],
		bg_image_url: '',
		theme_color: r.theme_color,
		condition: { type: 'score', min: index * 34, max: (index + 1) * 33 },
	}));
};

// 다음 단계 진행 가능 여부 검증
export const canProceedToNext = (currentStep: any, data: any): boolean => {
	switch (currentStep) {
		case 'type':
			return data.selectedType !== null;
		case 'basic':
			return data.testData.title.trim() && data.testData.category_ids.length > 0;
		case 'questions':
			return (
				data.questions.length > 0 &&
				data.questions.every(
					(q: any) => q.text.trim() && q.choices.length >= 2 && q.choices.every((c: any) => c.text.trim())
				)
			);
		case 'results':
			return data.results.length > 0 && data.results.every((r: any) => r.name.trim() && r.description.trim());
		default:
			return true;
	}
};

import type { Test, TestType, TestStatus } from '@repo/supabase';

// 테스트 타입별 표시명 설정
export const TEST_TYPE_CONFIG = {
	psychology: {
		name: '심리형',
		description: 'MBTI, 색상/동물 등 성향 분석',
	},
	balance: {
		name: '밸런스형',
		description: '2지선다/다지선다 선택',
	},
	character: {
		name: '캐릭터 매칭형',
		description: '특정 IP/캐릭터와 매칭',
	},
	quiz: {
		name: '퀴즈형',
		description: '지식/정답 기반',
	},
	meme: {
		name: '밈형',
		description: '밈/이모지 매칭',
	},
	lifestyle: {
		name: '라이프스타일형',
		description: '취향 기반',
	},
} as const;

// 테스트 상태별 표시명 설정
export const TEST_STATUS_CONFIG = {
	draft: {
		name: '초안',
	},
	published: {
		name: '공개',
	},
	scheduled: {
		name: '예약',
	},
	archived: {
		name: '보관',
	},
} as const;

export function getTestTypeInfo(type: TestType | string) {
	// DB에서 오는 type이 우리가 정의한 타입과 다를 수 있으므로 fallback 처리
	return (
		TEST_TYPE_CONFIG[type as TestType] || {
			name: '알 수 없음',
			description: '알 수 없는 테스트 유형',
		}
	);
}

export function getTestStatusInfo(status: TestStatus | string) {
	// DB에서 오는 status가 우리가 정의한 상태와 다를 수 있으므로 fallback 처리
	return (
		TEST_STATUS_CONFIG[status as TestStatus] || {
			name: '알 수 없음',
		}
	);
}

export function formatTestDuration(minutes: number): string {
	if (minutes < 1) return '1분 미만';
	if (minutes < 60) return `${Math.round(minutes)}분`;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = Math.round(minutes % 60);
	return remainingMinutes > 0 ? `${hours}시간 ${remainingMinutes}분` : `${hours}시간`;
}

export function calculateEstimatedTime(test: Test): number {
	// 질문당 평균 소요시간 (초)
	const baseTimePerQuestion = 30;
	const questionTime = test.questions.length * baseTimePerQuestion;

	// 유형별 가중치
	const typeMultiplier = {
		psychology: 1.2, // 심리형은 조금 더 오래 걸림
		balance: 0.8, // 밸런스형은 빠름
		character: 1.0, // 기본
		quiz: 1.5, // 퀴즈형은 생각 시간 필요
		meme: 0.7, // 밈형은 매우 빠름
		lifestyle: 1.1, // 라이프스타일은 약간 오래
	};

	return Math.round((questionTime * typeMultiplier[test.type]) / 60); // 분 단위로 변환
}

export function getQuestionStats(test: Test) {
	const optionCounts = test.questions.map((q) => q.options.length);
	return {
		total: test.questions.length,
		avgOptions: Math.round((optionCounts.reduce((a, b) => a + b, 0) / optionCounts.length) * 10) / 10,
		minOptions: Math.min(...optionCounts),
		maxOptions: Math.max(...optionCounts),
		groups: [...new Set(test.questions.map((q) => q.group).filter(Boolean))],
	};
}

export function getResultStats(test: Test) {
	return {
		total: test.results.length,
		withEmoji: test.results.filter((r) => r.emoji).length,
		withTheme: test.results.filter((r) => r.themeColor).length,
		avgKeywords:
			Math.round((test.results.reduce((sum, r) => sum + r.keywords.length, 0) / test.results.length) * 10) / 10,
	};
}

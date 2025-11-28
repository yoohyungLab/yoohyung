import type { Test, TestType, TestStatus } from '@pickid/supabase';

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

// 테스트 통계 계산
export function calculateTestStats(questions: unknown[] = [], results: unknown[] = []) {
	return {
		totalQuestions: questions.length,
		totalResults: results.length,
	};
}

// 카테고리 ID 배열을 카테고리 이름 배열로 변환
export function getCategoryNames(
	categoryIds: string[] | null | undefined,
	categories: Array<{ id: string; name: string }>
): string[] {
	if (!categoryIds || categoryIds.length === 0) {
		return [];
	}

	return categoryIds
		.map((id) => {
			const category = categories.find((cat) => cat.id === id);
			return category?.name || '';
		})
		.filter((name) => name !== '');
}

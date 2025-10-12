// Google Analytics 이벤트 트래킹 유틸리티

// gtag 타입 확장
declare global {
	interface Window {
		gtag: (
			command: 'config' | 'event' | 'js' | 'set',
			targetId: string | Date,
			config?: Record<string, unknown>
		) => void;
	}
}

// 페이지뷰 이벤트
export const pageview = (url: string) => {
	if (typeof window.gtag !== 'undefined') {
		window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
			page_path: url,
		});
	}
};

// 커스텀 이벤트
export const event = ({
	action,
	category,
	label,
	value,
}: {
	action: string;
	category: string;
	label?: string;
	value?: number;
}) => {
	if (typeof window.gtag !== 'undefined') {
		window.gtag('event', action, {
			event_category: category,
			event_label: label,
			value: value,
		});
	}
};

// 테스트 관련 이벤트들
export const trackTestStart = (testId: string, testTitle: string) => {
	event({
		action: 'test_start',
		category: 'engagement',
		label: testTitle,
		value: 1,
	});
};

export const trackTestComplete = (testId: string, testTitle: string, completionTime: number) => {
	event({
		action: 'test_complete',
		category: 'engagement',
		label: testTitle,
		value: Math.round(completionTime),
	});
};

export const trackQuestionAnswer = (testId: string, questionNumber: number) => {
	event({
		action: 'question_answer',
		category: 'engagement',
		label: `question_${questionNumber}`,
	});
};

export const trackResultShare = (testId: string, resultType: string, shareMethod: string) => {
	event({
		action: 'result_share',
		category: 'social',
		label: `${resultType}_${shareMethod}`,
	});
};

export const trackResultView = (testId: string, resultType: string) => {
	event({
		action: 'result_view',
		category: 'engagement',
		label: resultType,
	});
};

// 기존 코드 호환성을 위한 별칭
export const trackResultViewed = (testId: string, resultName: string, isLoggedIn: boolean) => {
	event({
		action: 'result_viewed',
		category: 'engagement',
		label: `${resultName}_${isLoggedIn ? 'logged_in' : 'guest'}`,
	});
};

export const trackResultShared = (shareMethod: string, testId: string, resultName: string) => {
	event({
		action: 'result_shared',
		category: 'social',
		label: `${shareMethod}_${resultName}`,
	});
};

export const trackCategoryView = (categorySlug: string) => {
	event({
		action: 'category_view',
		category: 'navigation',
		label: categorySlug,
	});
};

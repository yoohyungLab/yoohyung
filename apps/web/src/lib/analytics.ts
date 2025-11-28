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

// 커스텀 이벤트 (내부 헬퍼)
const event = ({
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

// 실제 사용되는 이벤트만 export
export const trackTestStart = (testId: string, testTitle: string) => {
	event({
		action: 'test_start',
		category: 'engagement',
		label: testTitle,
		value: 1,
	});
};

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

// 분석 이벤트 추적 함수들

export const trackResultViewed = (testType: string, resultType: string, isLoggedIn: boolean) => {
	console.log('Result viewed:', { testType, resultType, isLoggedIn });
	// 실제 분석 도구 연동 시 여기에 구현
};

export const trackResultShared = (action: string, testType: string, resultType: string) => {
	console.log('Result shared:', { action, testType, resultType });
	// 실제 분석 도구 연동 시 여기에 구현
};

export const trackCtaClicked = (action: string, testType: string, metadata?: Record<string, unknown>) => {
	console.log('CTA clicked:', { action, testType, metadata });
	// 실제 분석 도구 연동 시 여기에 구현
};

export const trackNextTestImpression = (
	recommendedTests: Array<{ test_id: string; rank: number }>,
	algorithm: string
) => {
	console.log('Next test impression:', { recommendedTests, algorithm });
	// 실제 분석 도구 연동 시 여기에 구현
};

export const trackTestStarted = (testType: string) => {
	console.log('Test started:', { testType });
	// 실제 분석 도구 연동 시 여기에 구현
};

export const trackTestCompleted = (testType: string, resultType: string, score: number, duration: number) => {
	console.log('Test completed:', { testType, resultType, score, duration });
	// 실제 분석 도구 연동 시 여기에 구현
};

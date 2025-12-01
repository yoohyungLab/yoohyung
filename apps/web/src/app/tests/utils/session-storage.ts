// 세션 스토리지 유틸리티

export function saveTestResult<T>(data: T & { testId?: string }): void {
	if (typeof window === 'undefined') return;

	try {
		const key = data.testId ? `test_result_${data.testId}` : 'testResult';
		sessionStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save test result:', error);
	}
}

export function loadTestResult<T>(testId?: string): T | null {
	if (typeof window === 'undefined') return null;

	try {
		const key = testId ? `test_result_${testId}` : 'testResult';
		const data = sessionStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error('Failed to load test result:', error);
		return null;
	}
}



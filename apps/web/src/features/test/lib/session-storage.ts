/**
 * 세션 스토리지 유틸리티
 */

const STORAGE_KEY = 'testResult';

export function saveTestResult<T>(data: T): void {
	if (typeof window === 'undefined') return;

	try {
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save test result:', error);
	}
}

export function loadTestResult<T>(): T | null {
	if (typeof window === 'undefined') return null;

	try {
		const data = sessionStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error('Failed to load test result:', error);
		return null;
	}
}

export function clearTestResult(): void {
	if (typeof window === 'undefined') return;

	try {
		sessionStorage.removeItem(STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear test result:', error);
	}
}

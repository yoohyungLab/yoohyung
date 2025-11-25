/**
 * 세션 스토리지 유틸리티
 */

const STORAGE_KEY = 'testResult';
const BALANCE_ANSWERS_KEY = 'balanceGameAnswers';

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

// 밸런스 게임 진행 중 선택값 누적 저장

interface IBalanceGameAnswer {
	questionId: string;
	choiceId: string;
}

/**
 * 밸런스 게임 답변 추가 (누적)
 */
export function addBalanceGameAnswer(testId: string, questionId: string, choiceId: string): void {
	if (typeof window === 'undefined') return;

	try {
		const key = `${BALANCE_ANSWERS_KEY}_${testId}`;
		const existing = sessionStorage.getItem(key);
		const answers: IBalanceGameAnswer[] = existing ? JSON.parse(existing) : [];

		// 같은 질문의 기존 답변 제거 후 추가
		const filtered = answers.filter((a) => a.questionId !== questionId);
		filtered.push({ questionId, choiceId });

		sessionStorage.setItem(key, JSON.stringify(filtered));
	} catch (error) {
		console.error('Failed to add balance game answer:', error);
	}
}

/**
 * 밸런스 게임 누적 답변 조회
 */
export function getBalanceGameAnswers(testId: string): IBalanceGameAnswer[] {
	if (typeof window === 'undefined') return [];

	try {
		const key = `${BALANCE_ANSWERS_KEY}_${testId}`;
		const data = sessionStorage.getItem(key);
		return data ? JSON.parse(data) : [];
	} catch (error) {
		console.error('Failed to load balance game answers:', error);
		return [];
	}
}

/**
 * 밸런스 게임 누적 답변 초기화
 */
export function clearBalanceGameAnswers(testId: string): void {
	if (typeof window === 'undefined') return;

	try {
		const key = `${BALANCE_ANSWERS_KEY}_${testId}`;
		sessionStorage.removeItem(key);
	} catch (error) {
		console.error('Failed to clear balance game answers:', error);
	}
}

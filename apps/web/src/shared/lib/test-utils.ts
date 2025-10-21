import type { TTestType } from '@/shared/types';

export function getHomeButtonText(testType: TTestType): string {
	switch (testType) {
		case 'balance':
			return '다른 밸런스 게임 보러가기';
		case 'psychology':
			return '다른 심리 테스트 보러가기';
		case 'personality':
			return '다른 성격 테스트 보러가기';
		default:
			return '다른 테스트 보러가기';
	}
}

export function getTestTypeName(testType: TTestType): string {
	switch (testType) {
		case 'balance':
			return '밸런스 게임';
		case 'psychology':
			return '심리테스트';
		case 'personality':
			return '성격테스트';
		default:
			return '테스트';
	}
}

export function isMobileDevice(): boolean {
	return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}


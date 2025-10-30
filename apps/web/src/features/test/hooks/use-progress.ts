/**
 * 테스트 진행률 계산 훅
 */
export function useProgress(currentIndex: number, total: number) {
	const percentage = Math.round(((currentIndex + 1) / total) * 100);
	const canGoBack = currentIndex > 0;
	const isLast = currentIndex >= total - 1;

	return {
		current: currentIndex + 1, // 1-based
		total,
		percentage,
		canGoBack,
		isLast,
	};
}

import { useState, useCallback } from 'react';

/**
 * 밸런스게임 질문 상태 관리 훅 (UI 상태만)
 * - 선택 상태 관리
 * - 결과 표시 상태 관리
 *
 * Note: 통계 조회는 컴포넌트에서 useTestBalanceGameQuestionStats 직접 호출
 */
export function useBalanceGameQuestion() {
	const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
	const [showResult, setShowResult] = useState(false);

	const handleSelect = useCallback((choiceId: string) => {
		setSelectedChoice(choiceId);
		setShowResult(true);
	}, []);

	const reset = useCallback(() => {
		setSelectedChoice(null);
		setShowResult(false);
	}, []);

	return {
		selectedChoice,
		showResult,
		handleSelect,
		reset,
	};
}

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { testResponseService } from '@/api/services/test-response.service';
import { optimizedBalanceGameStatsService } from '@/api/services/optimized-balance-game-stats.service';
import type { OptimizedQuestionStats, OptimizedChoiceStats, QuestionWithChoices } from '@pickid/supabase';
import { calculatePercentages } from '@/lib/balance-game.utils';

// 로컬에서 관리할 통계 타입
type LocalChoiceStats = {
	id: string;
	choice_text: string;
	count: number;
};

type LocalQuestionStats = {
	questionId: string;
	choices: LocalChoiceStats[];
};

// 훅의 인자 타입
interface UseBalanceGameProps {
	testId: string;
	questions: QuestionWithChoices[]; // Use the new type here
}

/**
 * 밸런스 게임 테스트 진행 상태 전체를 관리하는 훅
 */
export const useBalanceGame = ({ testId, questions }: UseBalanceGameProps) => {
	// 1. 상태 정의
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<Map<string, string>>(new Map());
	const [localStats, setLocalStats] = useState<LocalQuestionStats[]>([]);

	// 2. 서버에서 초기 데이터 가져오기 (최초 1회)
	const { data: initialStats, isLoading: isLoadingInitialStats } = useQuery({
		queryKey: ['balanceGameStats', testId],
		queryFn: () => optimizedBalanceGameStatsService.getAllQuestionStatsRaw(testId),
		enabled: !!testId,
		staleTime: Infinity, // 테스트 진행 중에는 다시 불러오지 않음
		refetchOnWindowFocus: false,
	});

	// 3. 서버 데이터를 로컬 상태로 초기화
	useEffect(() => {
		if (initialStats) {
			const formattedStats: LocalQuestionStats[] = initialStats.map((q: OptimizedQuestionStats) => ({
				questionId: q.questionId,
				choices: q.choiceStats.map((c: OptimizedChoiceStats) => ({
					id: c.choiceId,
					choice_text: c.choiceText,
					count: c.responseCount,
				})),
			}));
			setLocalStats(formattedStats);
		}
	}, [initialStats]);

	// 4. 답변을 서버에 일괄 제출하는 Mutation
	const { mutate: submitAnswers, isPending: isSubmitting } = useMutation({
		mutationFn: () => {
			const votes = Array.from(answers.values()).map((choiceId) => ({
				choice_id: choiceId,
			}));
			return testResponseService.submitBalanceGameVotes(votes);
		},
		onError: (error) => {
			console.error('Failed to submit votes:', error);
			// TODO: 에러 처리 UI (e.g., toast)
		},
	});

	// 5. 선택지 선택 핸들러 (핵심: 낙관적 업데이트)
	const handleSelectChoice = (questionId: string, choiceId: string) => {
		// 로컬 답변 상태 업데이트
		const newAnswers = new Map(answers);
		newAnswers.set(questionId, choiceId);
		setAnswers(newAnswers);

		// 로컬 통계 상태 업데이트 (Optimistic Update)
		setLocalStats((prevStats) =>
			prevStats.map((q) => {
				if (q.questionId === questionId) {
					return {
						...q,
						choices: q.choices.map((c) => (c.id === choiceId ? { ...c, count: c.count + 1 } : c)),
					};
				}
				return q;
			})
		);

		// 다음 질문으로 이동
		setCurrentQuestionIndex((prev) => prev + 1);
	};

	// 6. 현재 질문과 계산된 통계 메모이제이션
	const currentQuestion: QuestionWithChoices = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

	const currentQuestionStats = useMemo(() => {
		if (!currentQuestion || localStats.length === 0) return null;

		const statsForQuestion = localStats.find((q) => q.questionId === currentQuestion.id);
		if (!statsForQuestion) return null;

		return calculatePercentages(statsForQuestion.choices);
	}, [currentQuestion, localStats]);

	// 7. 테스트 완료 여부
	const isCompleted = currentQuestionIndex >= questions.length;

	return {
		currentQuestion,
		currentQuestionIndex,
		totalQuestions: questions.length,
		currentQuestionStats,
		handleSelectChoice,
		isLoading: isLoadingInitialStats,
		isCompleted,
		submitAnswers,
		isSubmitting,
		answers, // 결과 페이지 전달용
	};
};
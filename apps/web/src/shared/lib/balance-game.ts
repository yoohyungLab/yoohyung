import type { IBalanceGameStats, IControversialChoice, IOverwhelmingChoice } from '@/shared/types';
import type { OptimizedChoiceStats } from '@pickid/supabase';

// 통계 계산 유틸리티

/**
 * 선택지별 응답 수를 기반으로 퍼센티지 계산
 */
export function calculatePercentages(
	choices: Array<{ choiceId: string; responseCount: number }>
): Array<{ choiceId: string; responseCount: number; percentage: number }> {
	const totalResponses = choices.reduce((sum, choice) => sum + choice.responseCount, 0);

	return choices.map((choice) => ({
		...choice,
		percentage: totalResponses > 0 ? Math.round((choice.responseCount / totalResponses) * 100) : 0,
	}));
}

/**
 * 단일 선택지의 퍼센티지 계산
 */
export function calculateSinglePercentage(responseCount: number, totalResponses: number): number {
	return totalResponses > 0 ? Math.round((responseCount / totalResponses) * 100) : 0;
}

/**
 * A/B 두 선택지의 퍼센티지 계산
 */
export function calculateABPercentages(votesA: number, votesB: number) {
	const totalVotes = votesA + votesB;

	if (totalVotes === 0) {
		return { percentageA: 50, percentageB: 50 };
	}

	return {
		percentageA: Math.round((votesA / totalVotes) * 100),
		percentageB: Math.round((votesB / totalVotes) * 100),
	};
}

/**
 * 누적 통계 정규화 (퍼센티지 재계산)
 */
export function normalizeAccumulatedStats(stats: OptimizedChoiceStats[]): OptimizedChoiceStats[] {
	const totalResponses = stats.reduce((sum, stat) => sum + stat.responseCount, 0);

	return stats.map((stat) => ({
		...stat,
		percentage: calculateSinglePercentage(stat.responseCount, totalResponses),
	}));
}

/**
 * 낙관적 업데이트: 선택한 항목에 +1 적용
 */
export function applyOptimisticUpdate(
	choices: Array<{ choiceId: string; responseCount: number }>,
	selectedChoiceId: string
): Array<{ choiceId: string; responseCount: number }> {
	return choices.map((choice) => ({
		...choice,
		responseCount: choice.choiceId === selectedChoiceId ? choice.responseCount + 1 : choice.responseCount,
	}));
}

/**
 * 진행률 계산
 */
export function calculateProgress(current: number, total: number): number {
	return Math.round((current / total) * 100);
}

// 밸런스게임 비즈니스 로직

/**
 * 사용자 답변 통계 계산 (A/B 선택 비율)
 */
export function calculateUserStats(userAnswers: string[]) {
	const aCount = userAnswers.filter((_, index) => index % 2 === 0).length;
	const bCount = userAnswers.length - aCount;
	const total = userAnswers.length;

	return {
		aCount,
		bCount,
		total,
		aPercentage: calculateSinglePercentage(aCount, total),
		bPercentage: calculateSinglePercentage(bCount, total),
	};
}

/**
 * 가장 인기 있는 선택지 찾기
 */
export function findMostPopularChoice(stats: IBalanceGameStats[]) {
	if (!stats || stats.length === 0) return null;

	return stats.reduce((max, current) => ((current.responseCount || 0) > (max.responseCount || 0) ? current : max));
}

/**
 * A/B 선택지 통계 계산 (전체 누적)
 */
export function calculateABStats(cumulativeStats: IBalanceGameStats[]) {
	const totalAChoices = cumulativeStats.reduce((sum, stat) => {
		return sum + (stat.responseCount || 0);
	}, 0);

	const totalBChoices = cumulativeStats.reduce((sum, stat) => {
		return sum + (stat.responseCount || 0);
	}, 0);

	const totalChoices = totalAChoices + totalBChoices;
	const globalAPercentage = calculateSinglePercentage(totalAChoices, totalChoices);
	const globalBPercentage = calculateSinglePercentage(totalBChoices, totalChoices);

	return {
		totalAChoices,
		totalBChoices,
		totalChoices,
		globalAPercentage: globalAPercentage || 50,
		globalBPercentage: globalBPercentage || 50,
	};
}

/**
 * 사용자 선택과 전체 통계 비교
 */
export function calculateComparisonStats(
	userAnswers: string[],
	cumulativeStats: IBalanceGameStats[]
): {
	userChoicePercentage: number;
	isMinority: boolean;
	oppositePercentage: number;
} {
	if (!userAnswers || !cumulativeStats || cumulativeStats.length === 0) {
		return {
			userChoicePercentage: 0,
			isMinority: false,
			oppositePercentage: 0,
		};
	}

	const userStats = calculateUserStats(userAnswers);
	const abStats = calculateABStats(cumulativeStats);

	const userPrefersA = userStats.aCount > userStats.bCount;
	const isMinority = userPrefersA
		? userStats.aPercentage < abStats.globalAPercentage
		: userStats.bPercentage < abStats.globalBPercentage;

	return {
		userChoicePercentage: userPrefersA ? userStats.aPercentage : userStats.bPercentage,
		isMinority,
		oppositePercentage: userPrefersA ? userStats.bPercentage : userStats.aPercentage,
	};
}

/**
 * 선택지 통계 찾기
 */
export function findChoiceStat(
	choiceId: string,
	choiceStats?: IBalanceGameStats[],
	fallbackStats?: IBalanceGameStats[]
): { percentage: number; count: number } {
	const choiceStat =
		choiceStats?.find((cs) => cs.choiceId === choiceId) || fallbackStats?.find((cs) => cs.choiceId === choiceId);

	return {
		percentage: choiceStat?.percentage || 0,
		count: choiceStat?.responseCount || 0,
	};
}

/**
 * 가장 논란이 많은 질문 찾기 (선택지 비율이 가장 비슷한 질문)
 * @param questionStats 질문별 통계 배열
 */
export function findControversialChoice(
	questionStats: Array<{
		questionId: string;
		questionText: string;
		choiceStats: IBalanceGameStats[];
		totalResponses: number;
	}>
): IControversialChoice | null {
	if (!questionStats || questionStats.length === 0) return null;

	let mostControversial: IControversialChoice | null = null;
	let smallestDifference = Infinity;

	questionStats.forEach((question) => {
		// 응답이 하나도 없는 질문은 제외
		if (question.totalResponses === 0) return;
		if (question.choiceStats.length < 2) return;

		const [choiceA, choiceB] = question.choiceStats;
		const aPercentage = choiceA.percentage;
		const bPercentage = choiceB.percentage;

		const difference = Math.abs(aPercentage - bPercentage);

		if (difference < smallestDifference) {
			smallestDifference = difference;
			mostControversial = {
				id: question.questionId,
				question_text: question.questionText,
				questionId: question.questionId,
				questionText: question.questionText,
				choiceA: {
					text: choiceA.choiceText,
					percentage: aPercentage,
					count: choiceA.responseCount || 0,
				},
				choiceB: {
					text: choiceB.choiceText,
					percentage: bPercentage,
					count: choiceB.responseCount || 0,
				},
				totalResponses: question.totalResponses,
			};
		}
	});

	return mostControversial;
}

/**
 * 가장 압도적인 선택이 있는 질문 찾기 (한쪽 선택지가 월등히 많은 질문)
 * @param questionStats 질문별 통계 배열
 */
export function findOverwhelmingChoice(
	questionStats: Array<{
		questionId: string;
		questionText: string;
		choiceStats: IBalanceGameStats[];
		totalResponses: number;
	}>
): IOverwhelmingChoice | null {
	if (!questionStats || questionStats.length === 0) return null;

	let mostOverwhelming: IOverwhelmingChoice | null = null;
	let bestDominanceScore = 0;

	questionStats.forEach((question) => {
		// 응답이 하나도 없는 질문은 제외
		if (question.totalResponses === 0) return;
		if (question.choiceStats.length < 2) return;

		const [choiceA, choiceB] = question.choiceStats;
		const aPercentage = choiceA.percentage;
		const bPercentage = choiceB.percentage;

		const maxPercentage = Math.max(aPercentage, bPercentage);
		const minPercentage = Math.min(aPercentage, bPercentage);
		const dominanceScore = maxPercentage - minPercentage;

		if (dominanceScore > bestDominanceScore) {
			const isAWinning = aPercentage > bPercentage;
			mostOverwhelming = {
				id: question.questionId,
				question_text: question.questionText,
				questionId: question.questionId,
				questionText: question.questionText,
				winningChoice: {
					text: isAWinning ? choiceA.choiceText : choiceB.choiceText,
					percentage: maxPercentage,
					count: isAWinning ? choiceA.responseCount || 0 : choiceB.responseCount || 0,
				},
				losingChoice: {
					text: isAWinning ? choiceB.choiceText : choiceA.choiceText,
					percentage: minPercentage,
					count: isAWinning ? choiceB.responseCount || 0 : choiceA.responseCount || 0,
				},
				totalResponses: question.totalResponses,
			};
			bestDominanceScore = dominanceScore;
		}
	});

	return mostOverwhelming;
}

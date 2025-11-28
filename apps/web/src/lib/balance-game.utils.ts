// TODO: 수정 필요
import type { OptimizedChoiceStats } from '@pickid/supabase';
import type { HomeBalanceGameResponse } from '@/api/services';
import type { IControversialChoice, IOverwhelmingChoice } from '@/app/tests/types/balance-game';
import { BALANCE_GAME_DEFAULTS } from '@/constants/balance-game';

// 기본 통계 계산 (홈 페이지용)
export function calculateBalanceGameStats(game: HomeBalanceGameResponse) {
	const totalVotes = game.totalVotes || 0;
	const votesA = game.votesA || 0;
	const votesB = game.votesB || 0;

	return {
		totalVotes,
		votesA,
		votesB,
		percentageA: totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : BALANCE_GAME_DEFAULTS.percentageA,
		percentageB: totalVotes > 0 ? Math.round((votesB / totalVotes) * 100) : BALANCE_GAME_DEFAULTS.percentageB,
	};
}

export function createBalanceGameOptions(
	game: HomeBalanceGameResponse,
	stats: ReturnType<typeof calculateBalanceGameStats>
) {
	return [
		{
			id: 'A' as const,
			emoji: game.optionAEmoji,
			label: game.optionALabel,
			votes: stats.votesA || 0,
			percentage: stats.percentageA || 0,
		},
		{
			id: 'B' as const,
			emoji: game.optionBEmoji,
			label: game.optionBLabel,
			votes: stats.votesB || 0,
			percentage: stats.percentageB || 0,
		},
	];
}

export function getVoteCountText(totalVotes: number): string {
	return totalVotes > 0 ? `${totalVotes.toLocaleString()}명 참여` : '아직 투표가 없습니다';
}

// 퍼센티지 계산
export function calculateSinglePercentage(responseCount: number, totalResponses: number): number {
	return totalResponses > 0 ? Math.round((responseCount / totalResponses) * 100) : 0;
}

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

export function calculatePercentages(
	choices: Array<{ choiceId: string; responseCount: number }>
): Array<{ choiceId: string; responseCount: number; percentage: number }> {
	const totalResponses = choices.reduce((sum, choice) => sum + choice.responseCount, 0);

	return choices.map((choice) => ({
		...choice,
		percentage: totalResponses > 0 ? Math.round((choice.responseCount / totalResponses) * 100) : 0,
	}));
}

// 통계 정규화 및 업데이트
export function normalizeAccumulatedStats(stats: OptimizedChoiceStats[]): OptimizedChoiceStats[] {
	const totalResponses = stats.reduce((sum, stat) => sum + stat.responseCount, 0);

	return stats.map((stat) => ({
		...stat,
		percentage: calculateSinglePercentage(stat.responseCount, totalResponses),
	}));
}

// 사용자 통계 분석 (내부 헬퍼)
function calculateUserStats(userAnswers: string[]) {
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

export function calculateABStats(cumulativeStats: OptimizedChoiceStats[]) {
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

export function calculateComparisonStats(
	userAnswers: string[],
	cumulativeStats: OptimizedChoiceStats[]
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

// 선택지 분석
export function findMostPopularChoice(stats: OptimizedChoiceStats[]) {
	if (!stats || stats.length === 0) return null;

	return stats.reduce((max, current) => ((current.responseCount || 0) > (max.responseCount || 0) ? current : max));
}

export function findChoiceStat(
	choiceId: string,
	choiceStats?: OptimizedChoiceStats[],
	fallbackStats?: OptimizedChoiceStats[]
): { percentage: number; count: number } {
	const choiceStat =
		choiceStats?.find((cs) => cs.choiceId === choiceId) || fallbackStats?.find((cs) => cs.choiceId === choiceId);

	return {
		percentage: choiceStat?.percentage || 0,
		count: choiceStat?.responseCount || 0,
	};
}

// 논란/압도적 선택 분석
export function findControversialChoice(
	questionStats: Array<{
		questionId: string;
		questionText: string;
		choiceStats: OptimizedChoiceStats[];
		totalResponses: number;
	}>
): IControversialChoice | null {
	if (!questionStats || questionStats.length === 0) return null;

	let mostControversial: IControversialChoice | null = null;
	let smallestDifference = Infinity;

	questionStats.forEach((question) => {
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

export function findOverwhelmingChoice(
	questionStats: Array<{
		questionId: string;
		questionText: string;
		choiceStats: OptimizedChoiceStats[];
		totalResponses: number;
	}>
): IOverwhelmingChoice | null {
	if (!questionStats || questionStats.length === 0) return null;

	let mostOverwhelming: IOverwhelmingChoice | null = null;
	let bestDominanceScore = 0;

	questionStats.forEach((question) => {
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

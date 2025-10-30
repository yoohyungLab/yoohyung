import type { IBalanceGameStats, IControversialChoice, IOverwhelmingChoice } from '@/shared/types';

// Fixed theme: use a single consistent theme across tests
// Removed fixed theme helper; themes are now chosen globally in containers

export function calculateUserStats(userAnswers: string[]) {
	const aCount = userAnswers.filter((_, index) => index % 2 === 0).length;
	const bCount = userAnswers.length - aCount;
	const total = userAnswers.length;

	return {
		aCount,
		bCount,
		total,
		aPercentage: total > 0 ? Math.round((aCount / total) * 100) : 0,
		bPercentage: total > 0 ? Math.round((bCount / total) * 100) : 0,
	};
}

export function findMostPopularChoice(stats: IBalanceGameStats[]) {
	if (!stats || stats.length === 0) return null;

	return stats.reduce((max, current) => ((current.responseCount || 0) > (max.responseCount || 0) ? current : max));
}

export function calculateABStats(cumulativeStats: IBalanceGameStats[]) {
	const totalAChoices = cumulativeStats.reduce((sum, stat) => {
		return sum + (stat.responseCount || 0);
	}, 0);

	const totalBChoices = cumulativeStats.reduce((sum, stat) => {
		return sum + (stat.responseCount || 0);
	}, 0);

	const totalChoices = totalAChoices + totalBChoices;
	const globalAPercentage = totalChoices > 0 ? Math.round((totalAChoices / totalChoices) * 100) : 50;
	const globalBPercentage = totalChoices > 0 ? Math.round((totalBChoices / totalChoices) * 100) : 50;

	return {
		totalAChoices,
		totalBChoices,
		totalChoices,
		globalAPercentage,
		globalBPercentage,
	};
}

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

export function calculateProgress(current: number, total: number): number {
	return Math.round((current / total) * 100);
}

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

	questionStats.forEach((question, index) => {
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
		choiceStats: IBalanceGameStats[];
		totalResponses: number;
	}>
): IOverwhelmingChoice | null {
	if (!questionStats || questionStats.length === 0) return null;

	let mostOverwhelming: IOverwhelmingChoice | null = null;
	let bestDominanceScore = 0;

	questionStats.forEach((question) => {
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

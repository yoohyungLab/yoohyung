import type { IBalanceGameTheme, IBalanceGameStats, IControversialChoice, IOverwhelmingChoice } from '@/shared/types';

export function generateThemeFromTestId(testId: string): IBalanceGameTheme {
	const hash = testId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
	const themes: IBalanceGameTheme[] = [
		{
			gradient: 'from-purple-200 via-purple-100 to-pink-200',
			primary: 'purple',
			secondary: 'pink',
			accent: 'blue',
			question: 'from-purple-300 to-pink-300',
			choice: 'purple',
			progress: 'from-purple-600 via-purple-700 to-pink-600',
		},
		{
			gradient: 'from-blue-200 via-blue-100 to-indigo-200',
			primary: 'blue',
			secondary: 'indigo',
			accent: 'purple',
			question: 'from-blue-300 to-indigo-300',
			choice: 'blue',
			progress: 'from-blue-600 via-blue-700 to-indigo-600',
		},
		{
			gradient: 'from-green-200 via-green-100 to-emerald-200',
			primary: 'green',
			secondary: 'emerald',
			accent: 'teal',
			question: 'from-green-300 to-emerald-300',
			choice: 'green',
			progress: 'from-green-600 via-green-700 to-emerald-600',
		},
		{
			gradient: 'from-orange-200 via-orange-100 to-red-200',
			primary: 'orange',
			secondary: 'red',
			accent: 'yellow',
			question: 'from-orange-300 to-red-300',
			choice: 'orange',
			progress: 'from-orange-600 via-orange-700 to-red-600',
		},
		{
			gradient: 'from-cyan-200 via-cyan-100 to-sky-200',
			primary: 'cyan',
			secondary: 'sky',
			accent: 'blue',
			question: 'from-cyan-300 to-sky-300',
			choice: 'cyan',
			progress: 'from-cyan-600 via-cyan-700 to-sky-600',
		},
		{
			gradient: 'from-violet-200 via-violet-100 to-purple-200',
			primary: 'violet',
			secondary: 'purple',
			accent: 'pink',
			question: 'from-violet-300 to-purple-300',
			choice: 'violet',
			progress: 'from-violet-600 via-violet-700 to-purple-600',
		},
		{
			gradient: 'from-rose-200 via-rose-100 to-pink-200',
			primary: 'rose',
			secondary: 'pink',
			accent: 'red',
			question: 'from-rose-300 to-pink-300',
			choice: 'rose',
			progress: 'from-rose-600 via-rose-700 to-pink-600',
		},
		{
			gradient: 'from-teal-200 via-teal-100 to-cyan-200',
			primary: 'teal',
			secondary: 'cyan',
			accent: 'blue',
			question: 'from-teal-300 to-cyan-300',
			choice: 'teal',
			progress: 'from-teal-600 via-teal-700 to-cyan-600',
		},
	];

	return themes[hash % themes.length];
}

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

	questionStats.forEach((question) => {
		if (question.choiceStats.length < 2) return;

		const [choiceA, choiceB] = question.choiceStats;
		const aPercentage = choiceA.percentage;
		const bPercentage = choiceB.percentage;

		const difference = Math.abs(aPercentage - bPercentage);

		if (
			difference <
			(mostControversial
				? Math.abs(mostControversial.choiceA.percentage - mostControversial.choiceB.percentage)
				: Infinity)
		) {
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

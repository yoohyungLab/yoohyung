interface Choice {
	id: string;
	count: number;
	choice_text: string; // Make it required
	questionId: string; // Add this
	[key: string]: any;
}

interface ChoiceWithPercentage extends Choice {
	percentage: number;
}

export const calculatePercentages = (choices: Choice[]): ChoiceWithPercentage[] => {
	const totalVotes = choices.reduce((sum, choice) => sum + (choice.count || choice.responseCount || 0), 0);

	if (totalVotes === 0) {
		const percentage = choices.length > 0 ? 100 / choices.length : 0;
		return choices.map((choice) => ({
			...choice,
			percentage: percentage,
		}));
	}

	return choices.map((choice) => ({
		...choice,
		percentage: Math.round(((choice.count || choice.responseCount || 0) / totalVotes) * 100),
	}));
};

// 타입 구조를 만족시키는 Placeholder 구현
export const calculateComparisonStats = (userChoices: any[], overallStats: any[]) => {
	return {
		userChoicePercentage: 50,
		isMinority: false,
		oppositePercentage: 50,
	};
};

export const findControversialChoice = (questionStats: any[]) => {
	if (!questionStats || questionStats.length === 0) return null;
	return {
		id: 'placeholder-q1',
		question_text: '가장 팽팽했던 질문 (임시 데이터)',
		questionId: 'placeholder-q1',
		questionText: '가장 팽팽했던 질문 (임시 데이터)',
		choiceA: { text: '선택 A', percentage: 50, count: 10 },
		choiceB: { text: '선택 B', percentage: 50, count: 10 },
		totalResponses: 20,
	};
};

export const findOverwhelmingChoice = (questionStats: any[]) => {
	if (!questionStats || questionStats.length === 0) return null;
	return {
		id: 'placeholder-q2',
		question_text: '가장 압도적이었던 질문 (임시 데이터)',
		questionId: 'placeholder-q2',
		questionText: '가장 압도적이었던 질문 (임시 데이터)',
		winningChoice: { text: '압도적인 선택', percentage: 90, count: 18 },
		losingChoice: { text: '소수 선택', percentage: 10, count: 2 },
		totalResponses: 20,
	};
};

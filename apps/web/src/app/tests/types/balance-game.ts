export type { QuestionWithChoices } from '@pickid/supabase';

export interface IControversialChoice {
	id: string;
	question_text: string;
	questionId: string;
	questionText: string;
	choiceA: {
		text: string;
		percentage: number;
		count: number;
	};
	choiceB: {
		text: string;
		percentage: number;
		count: number;
	};
	totalResponses: number;
}

export interface IOverwhelmingChoice {
	id: string;
	question_text: string;
	questionId: string;
	questionText: string;
	winningChoice: {
		text: string;
		percentage: number;
		count: number;
	};
	losingChoice: {
		text: string;
		percentage: number;
		count: number;
	};
	totalResponses: number;
}

export interface BalanceGameResult {
	userChoiceSummary: {
		totalQuestions: number;
		aChoices: number;
		bChoices: number;
		aPercentage: number;
		bPercentage: number;
	};
	comparisonStats: {
		userChoicePercentage: number;
		isMinority: boolean;
		oppositePercentage: number;
	};
	overallStats: {
		totalParticipants: number;
		mostPopularChoice: {
			question: string;
			choice: string;
			percentage: number;
		};
		mostControversialQuestion: {
			question: string;
			aPercentage: number;
			bPercentage: number;
		};
		averageTimeSpent: number;
	};
	testMetadata: {
		testId: string;
		testTitle: string;
		category: string;
		completedAt: string;
	};
	userAnswers: Array<{
		questionId: string;
		choiceId: string;
	}>;
}

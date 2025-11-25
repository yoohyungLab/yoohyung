/**
 * Balance Game Feature Types
 */

import type { TestQuestion, TestChoice } from '@pickid/supabase';

// 밸런스 게임 옵션 (클라이언트 전용)
export interface IBalanceOption {
	id: 'A' | 'B';
	emoji: string;
	label: string;
	percentage: number;
}

export type BalanceOption = IBalanceOption;

// 밸런스 게임 질문 Props
export interface IBalanceGameQuestionProps {
	testId: string;
	question: Pick<TestQuestion, 'id' | 'question_text' | 'image_url'> & {
		choices: Array<Pick<TestChoice, 'id' | 'choice_text' | 'choice_order'>>;
	};
	questionNumber: number;
	totalQuestions: number;
	onAnswer: (questionId: string, choiceId: string) => void;
	onPrevious?: () => void;
}

// 밸런스 게임 결과 데이터 Props
export interface IUseBalanceGameResultDataProps {
	testId: string;
	userAnswers: Array<{
		questionId: string;
		choiceId: string;
	}>;
	enabled?: boolean;
}

// 밸런스 게임 결과 데이터
export interface IBalanceGameResult {
	// 사용자 선택 요약
	userChoiceSummary: {
		totalQuestions: number;
		aChoices: number;
		bChoices: number;
		aPercentage: number;
		bPercentage: number;
	};

	// 전체 통계와 비교
	comparisonStats: {
		userChoicePercentage: number;
		isMinority: boolean;
		oppositePercentage: number;
	};

	// 주제별 전체 통계
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

	// 테스트 메타데이터
	testMetadata: {
		testId: string;
		testTitle: string;
		category: string;
		completedAt: string;
	};

	// 사용자 답변 데이터
	userAnswers?: Array<{
		questionId: string;
		choiceId: string;
	}>;
}

export type BalanceGameResult = IBalanceGameResult;

// 논란스러운 선택지 (통계 계산용)
export interface IControversialChoice extends Pick<TestQuestion, 'id' | 'question_text'> {
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

// 압도적인 선택지 (통계 계산용)
export interface IOverwhelmingChoice extends Pick<TestQuestion, 'id' | 'question_text'> {
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

// 밸런스 게임 테마 (UI 설정용)
export interface IBalanceGameTheme {
	primary: string;
	accent: string;
	secondary: string;
	progress: string;
	question: string;
	choice: string;
	gradient: string;
}

// 밸런스 게임 통계
export interface IBalanceGameStats extends Pick<TestChoice, 'id' | 'choice_text'> {
	choiceId: string;
	choiceText: string;
	responseCount: number;
	percentage: number;
}

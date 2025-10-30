'use client';

// Result Containers
import { BalanceGameResultContainer } from './balance-game/balance-game-result-container';
import { QuizResultContainer } from './quiz/quiz-result-container';
import { TestResultContainer } from './psychology/test-result-container';

// ============================================================================
// Props
// ============================================================================

interface TestResultPageClientProps {
	testType: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function TestResultPageClient({ testType }: TestResultPageClientProps) {
	// Route to appropriate result container
	switch (testType) {
		case 'balance':
			return <BalanceGameResultContainer />;

		case 'quiz':
			return <QuizResultContainer />;

		case 'psychology':
		default:
			return <TestResultContainer />;
	}
}

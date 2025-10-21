'use client';

import { useRouter } from 'next/navigation';
import { TestContainer } from './test-container';
import { BalanceGameContainer } from './balance-game/balance-game-container';
import type { TestWithNestedDetails, Category } from '@pickid/supabase';

interface TestPageClientProps {
	test: TestWithNestedDetails;
	categories: Category[];
}

type TTestType = 'balance' | 'personality' | 'quiz' | 'survey' | 'default';

function getTestType(test: TestWithNestedDetails, categories: Category[]): TTestType {
	// 1. type 필드로 먼저 판별
	if (test.test?.type === 'balance') return 'balance';

	// 2. 카테고리로 판별
	const isBalanceByCategory = test.test?.category_ids?.some((categoryId) => {
		const category = categories.find((cat) => cat.id === categoryId);
		return category?.name === '밸런스게임';
	});

	if (isBalanceByCategory) return 'balance';

	// 3. 향후 확장을 위한 타입 추가 가능
	// if (test.test?.type === 'quiz') return 'quiz';
	// if (test.test?.type === 'survey') return 'survey';

	return 'default';
}

export function TestPageClient({ test, categories }: TestPageClientProps) {
	const router = useRouter();
	const testType = getTestType(test, categories);

	const handleComplete = () => router.push(`/tests/${test.test?.id}/result`);
	const handleExit = () => router.push('/');

	switch (testType) {
		case 'balance':
			return <BalanceGameContainer test={test} onComplete={handleComplete} onExit={handleExit} />;

		// 향후 확장 예시
		// case 'quiz':
		// 	return <QuizContainer test={test} onComplete={handleComplete} onExit={handleExit} />;

		// case 'survey':
		// 	return <SurveyContainer test={test} onComplete={handleComplete} onExit={handleExit} />;

		case 'default':
		default:
			return <TestContainer test={test} onComplete={handleComplete} onExit={handleExit} />;
	}
}

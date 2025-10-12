'use client';

import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useTestDetailVM, TestContainer, TestLoading } from '@/features/test';

export default function TestDetailPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.id as string;

	const { test, isLoading, error } = useTestDetailVM(testId || '');

	const handleComplete = async () => {
		router.push(`/tests/${testId}/result`);
	};

	const handleExit = () => {
		router.push('/');
	};

	if (isLoading || !test) {
		return <TestLoading />;
	}

	if (error) notFound();

	return <TestContainer test={test!} onComplete={handleComplete} onExit={handleExit} />;
}

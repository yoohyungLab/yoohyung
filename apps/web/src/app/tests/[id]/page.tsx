'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { useTestDetailVM } from '@/features/test/hooks';
import { useTestTakingVM, useTestResultVM } from '@/features/test-taking/hooks';
import { TestTakingInterface } from '@/features/test-taking/ui/test-taking-interface';
import { Loading } from '@/shared/components/loading';

export default function TestDetailPage() {
	const params = useParams();
	const router = useRouter();
	const testId = params?.id as string;

	const { test, isLoading, error } = useTestDetailVM(testId || '');
	const { saveTestResult } = useTestResultVM();

	const testTaking = useTestTakingVM({
		test,
		onComplete: async (result) => {
			try {
				await saveTestResult({
					testId: testId,
					answers: result.answers,
					completedAt: result.completedAt,
					duration: result.duration,
					gender: result.gender, // 성별 정보 전달
				});
			} catch {
				// 에러 발생 시에도 결과 페이지로 이동
			} finally {
				router.push(`/tests/${testId}/result`);
			}
		},
		onExit: () => router.push('/'),
	});

	// 로딩 상태
	if (isLoading) {
		return <Loading message="테스트를 불러오는 중..." fullScreen />;
	}

	// 에러가 있거나 테스트가 없는 경우 404
	if (error) {
		notFound();
	}

	// test가 null이 아닌 경우에만 렌더링 (위의 조건문에서 이미 확인됨)
	return <TestTakingInterface test={test!} onComplete={testTaking.onComplete!} onExit={testTaking.onExit!} />;
}
